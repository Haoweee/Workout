/**
 * Production-safe logging utility
 * Only logs in development, silent in production
 */

// const isDevelopment = import.meta.env.DEV;
// const isDevelopment = false; // Force production logging behavior
const isDevelopment = import.meta.env.DEV && import.meta.env.VITE_ENABLE_LOGGING !== 'false';

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  error: (...args: unknown[]) => {
    if (isDevelopment) {
      console.error(...args);
    }
  },

  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
};
