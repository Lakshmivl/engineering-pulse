/**
 * API configuration
 * Contains all API endpoints, request types, and base URLs
 * Centralizes API-related configuration for easier maintenance
 */

export const apiConfig = {
  // Base URL for API requests
  BASE_URL: process.env.REACT_APP_BASE_URL,

  // API endpoints
  ENDPOINTS: {
    PR_TABLE: '/api/pr-metrics/table',
    CONTRIBUTORS: '/api/pr-metrics/contributors',
    SUMMARY: '/api/pr-metrics/summary'
  },

  // Request types for API parameters
  REQUEST_TYPES: {
    PR_DETAILS: 'prdetails',
    CONTRIBUTORS: 'contributors',
    SUMMARY: 'summary'
  }
};

export default apiConfig;
