/**
 * Environment configuration
 * Contains all environment-specific configuration
 * Centralizes environment settings for easier deployment to different environments
 */

// Available environments
const ENVIRONMENTS = {
  DEVELOPMENT: {
    name: 'development',
    apiTimeout: 30000, // 30 seconds in milliseconds
    enableDebugLogs: true,
    mockResponses: false, // Enable mock responses for local development
    // Additional development-specific configuration
    features: {
      enablePerformanceLogs: true
    }
  },
  
  STAGING: {
    name: 'staging',
    apiTimeout: 45000, // 45 seconds in milliseconds
    enableDebugLogs: true,
    mockResponses: false,
    // Additional staging-specific configuration
    features: {
      enablePerformanceLogs: true
    }
  },
  
  PRODUCTION: {
    name: 'production',
    apiTimeout: 60000, // 60 seconds in milliseconds
    enableDebugLogs: false,
    mockResponses: false,
    // Additional production-specific configuration
    features: {
      enablePerformanceLogs: false
    }
  }
};

// Determine current environment
// In a real app, this would use environment variables from the hosting platform
const getCurrentEnvironment = () => {
  // For now, just use development by default
  return ENVIRONMENTS.DEVELOPMENT;
};

export const envConfig = {
  ENVIRONMENTS,
  CURRENT_ENV: getCurrentEnvironment()
};

export default envConfig;
