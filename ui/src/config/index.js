/**
 * Configuration index file
 * Centralizes and exports all configuration objects
 * Provides a single import point for all configuration needs
 */

import { apiConfig } from './api.config';
import { envConfig } from './env.config';
import { mockConfig } from './mock.config';

// Add any additional configuration imports here

export {
  apiConfig,
  envConfig,
  mockConfig
};

// You can also export default configuration
const config = {
  apiConfig,
  envConfig,
  mockConfig
};

export default config;
