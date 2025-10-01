import 'dotenv/config';

import {neon, neonConfig} from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import logger from './logger.js';

// Only use local Neon proxy if explicitly enabled
// For now, always connect directly to Neon cloud database
if(process.env.USE_NEON_LOCAL === 'true') {
    logger.info('Using Neon Local proxy for development');
    neonConfig.fetchEndpoint = 'http://localhost:5432/sql';
    neonConfig.useSecureWebSocket = false;
    neonConfig.poolQueryViaFetch = true;
} else {
    logger.info('Connecting directly to Neon cloud database');
}

const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql);

// Test database connection (skip during testing)
if (process.env.NODE_ENV !== 'test') {
    try {
        logger.info('Testing database connection...');
        await sql`SELECT 1 as test`;
        logger.info('Database connection successful');
    } catch (error) {
        logger.error('Database connection failed:', error);
    }
}

export { db, sql };
