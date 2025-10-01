// Test setup file
// Set environment variables for testing
process.env.NODE_ENV = 'test';
process.env.ARCJET_ENV = 'development'; // Reduce Arcjet warnings
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.JWT_SECRET = 'test-secret-key-for-testing';
process.env.ARCJET_KEY = 'test-arcjet-key';
process.env.LOG_LEVEL = 'silent'; // Completely silence logs during tests

// Suppress console warnings during tests for cleaner output
const originalWarn = console.warn;
const originalError = console.error;
const originalLog = console.log;

console.warn = (message, ...args) => {
  // Suppress Arcjet warnings during tests
  if (typeof message === 'string' && message.includes('✦Aj')) {
    return;
  }
  originalWarn(message, ...args);
};

console.error = (message, ...args) => {
  // Suppress Arcjet errors during tests
  if (typeof message === 'string' && message.includes('✦Aj')) {
    return;
  }
  // Also suppress winston error logs
  if (typeof message === 'string' && message.includes('error:')) {
    return;
  }
  originalError(message, ...args);
};

console.log = (message, ...args) => {
  // Suppress winston logs during tests
  if (
    typeof message === 'string' &&
    (message.includes('error:') || message.includes('info:'))
  ) {
    return;
  }
  originalLog(message, ...args);
};
