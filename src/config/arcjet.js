import arcjet, { shield, detectBot, slidingWindow } from '@arcjet/node';

// Determine mode based on environment
const isDevelopment = process.env.NODE_ENV === 'development';
const mode = isDevelopment ? 'DRY_RUN' : 'LIVE';

const aj = arcjet({
    key: process.env.ARCJET_KEY,
    rules: [
        shield({ 
            mode: mode 
        }),
        detectBot({
            mode: mode,
            // Allow more bot categories in development
            allow: [
                'CATEGORY:SEARCH_ENGINE', 
                'CATEGORY:PREVIEW',
                'CATEGORY:MONITOR',
                // Allow API clients like Postman, Insomnia, curl, etc.
                ...(isDevelopment ? [
                    'CATEGORY:API',
                    'CATEGORY:AUTOMATED'
                ] : [])
            ],
        }),
        slidingWindow({
            mode: mode,
            interval: isDevelopment ? '1m' : '2s',
            max: isDevelopment ? 100 : 10, // Much higher limit in development
        }),
    ],
});

export default aj;