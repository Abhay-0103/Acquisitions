import logger from '#config/logger.js';
import { jwttoken } from '#utils/jwt.js';

/**
 * Middleware to authenticate JWT token from cookies or Authorization header
 */
export const authenticateToken = async (req, res, next) => {
  try {
    // Get token from cookies first, then from Authorization header
    let token = req.cookies?.token;

    if (!token) {
      const authHeader = req.headers['authorization'];
      token =
        authHeader && authHeader.startsWith('Bearer ')
          ? authHeader.substring(7)
          : null;
    }

    if (!token) {
      logger.warn('Access attempt without token', {
        ip: req.ip,
        path: req.path,
        method: req.method,
        userAgent: req.get('User-Agent'),
      });

      return res.status(401).json({
        error: 'Authentication required',
        message: 'No token provided',
      });
    }

    // Verify the token
    const decoded = jwttoken.verify(token);

    // Add user info to request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    logger.debug('Token authenticated successfully', {
      userId: decoded.id,
      email: decoded.email,
      role: decoded.role,
    });

    next();
  } catch (error) {
    logger.error('Token authentication failed', {
      error: error.message,
      ip: req.ip,
      path: req.path,
      method: req.method,
    });

    if (error.message === 'Failed to authenticate with token') {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid or expired token',
      });
    }

    return res.status(500).json({
      error: 'Internal server error',
      message: 'Authentication service error',
    });
  }
};

/**
 * Middleware to require specific roles
 * @param {string[]} allowedRoles - Array of allowed roles
 */
export const requireRole = allowedRoles => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        logger.warn('Role check attempted without authenticated user', {
          ip: req.ip,
          path: req.path,
          method: req.method,
        });

        return res.status(401).json({
          error: 'Authentication required',
          message: 'User must be authenticated to access this resource',
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        logger.warn('Unauthorized role access attempt', {
          userId: req.user.id,
          userRole: req.user.role,
          requiredRoles: allowedRoles,
          path: req.path,
          method: req.method,
        });

        return res.status(403).json({
          error: 'Access denied',
          message: `Access restricted to: ${allowedRoles.join(', ')}`,
        });
      }

      logger.debug('Role authorization successful', {
        userId: req.user.id,
        userRole: req.user.role,
        path: req.path,
      });

      next();
    } catch (error) {
      logger.error('Role authorization error', {
        error: error.message,
        userId: req.user?.id,
        path: req.path,
      });

      return res.status(500).json({
        error: 'Internal server error',
        message: 'Authorization service error',
      });
    }
  };
};

/**
 * Middleware to optionally authenticate token (doesn't fail if no token)
 * Useful for endpoints that work with both authenticated and unauthenticated users
 */
export const optionalAuthenticate = async (req, res, next) => {
  try {
    // Get token from cookies first, then from Authorization header
    let token = req.cookies?.token;

    if (!token) {
      const authHeader = req.headers['authorization'];
      token =
        authHeader && authHeader.startsWith('Bearer ')
          ? authHeader.substring(7)
          : null;
    }

    if (!token) {
      // No token provided, continue without user info
      req.user = null;
      return next();
    }

    // Verify the token
    const decoded = jwttoken.verify(token);

    // Add user info to request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    logger.debug('Optional authentication successful', {
      userId: decoded.id,
      email: decoded.email,
      role: decoded.role,
    });

    next();
  } catch (error) {
    logger.warn('Optional authentication failed, continuing without user', {
      error: error.message,
      ip: req.ip,
      path: req.path,
    });

    // Continue without user info if token is invalid
    req.user = null;
    next();
  }
};
