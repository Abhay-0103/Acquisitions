import aj from '#config/arcjet.js';
import logger from '#config/logger.js';
import { slidingWindow } from '@arcjet/node';

const securityMiddleware = async (req, res, next) => {
  try {
    const role = req.user?.role || 'guest';
    const isDevelopment = process.env.NODE_ENV === 'development';
    const mode = isDevelopment ? 'DRY_RUN' : 'LIVE';

    let limit;

    if (isDevelopment) {
      // Much higher limits in development
      switch (role) {
        case 'admin':
          limit = 200;
          break;
        case 'user':
          limit = 100;
          break;
        case 'guest':
          limit = 50;
          break;
      }
    } else {
      // Production limits
      switch (role) {
        case 'admin':
          limit = 20;
          break;
        case 'user':
          limit = 10;
          break;
        case 'guest':
          limit = 5;
          break;
      }
    }

    const client = aj.withRule(
      slidingWindow({
        mode,
        interval: '1m',
        max: limit,
        name: `${role}-rate-limit`,
      })
    );

    const decision = await client.protect(req);

    // In development (DRY_RUN mode), log but don't block
    if (isDevelopment) {
      if (decision.isDenied() && decision.reason.isBot()) {
        logger.info('Bot request detected (development - not blocked)', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          path: req.path,
        });
      }

      if (decision.isDenied() && decision.reason.isShield()) {
        logger.info('Shield would block request (development - not blocked)', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          path: req.path,
          method: req.method,
        });
      }

      if (decision.isDenied() && decision.reason.isRateLimit()) {
        logger.info(
          'Rate limit would be exceeded (development - not blocked)',
          {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            path: req.path,
          }
        );
      }

      // Always continue in development
      return next();
    }

    // Production blocking behavior
    if (decision.isDenied() && decision.reason.isBot()) {
      logger.warn('Bot request blocked', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });

      return res.status(403).json({
        error: 'Forbidden',
        message: 'Automated requests are not allowed',
      });
    }

    if (decision.isDenied() && decision.reason.isShield()) {
      logger.warn('Shield Blocked request', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method,
      });

      return res.status(403).json({
        error: 'Forbidden',
        message: 'Request blocked by security policy',
      });
    }

    if (decision.isDenied() && decision.reason.isRateLimit()) {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });

      return res
        .status(403)
        .json({ error: 'Forbidden', message: 'Too many requests' });
    }

    next();
  } catch (e) {
    logger.error('Arcjet middleware error:', e);

    // In development, don't block on middleware errors
    if (process.env.NODE_ENV === 'development') {
      logger.warn(
        'Security middleware error in development - continuing anyway'
      );
      return next();
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong with security middleware',
    });
  }
};
export default securityMiddleware;
