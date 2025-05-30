/**
 * Mock configuration index file
 * Used for Jest tests
 */

// Mock API configuration
export const apiConfig = {
  BASE_URL: 'https://test-api.example.com',
  ENDPOINTS: {
    PR_TABLE: '/api/pr-metrics/table',
    CONTRIBUTORS: '/api/pr-metrics/contributors',
    SUMMARY: '/api/pr-metrics/summary'
  },
  REQUEST_TYPES: {
    PR_DETAILS: 'prdetails',
    CONTRIBUTORS: 'contributors',
    SUMMARY: 'summary'
  }
};

// Mock environment configuration
export const envConfig = {
  CURRENT_ENV: {
    apiTimeout: 30000,
    mockResponses: true
  }
};

// Mock data configuration
export const mockConfig = {
  MOCK_SUMMARY: {
    total_prs: 145,
    merged_prs: 122,
    avg_pr_size: 154
  },
  MOCK_PR_TABLE: [
    {
      rowNumber: 1,
      Jira_ID: 'TEST-123',
      repository: 'test-repo',
      PRNumber: 'PR-456',
      State: 'Merged',
      Author: 'Test User'
    }
  ],
  MOCK_CONTRIBUTORS: {
    top_reviewers: [
      { name: 'Test User', reviews: 28 }
    ]
  },
  // Function to simulate API delay
  getWithDelay: (mockData, delayMs = 10) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData);
      }, delayMs);
    });
  }
};

// Default export to handle both import styles
export default {
  apiConfig,
  envConfig,
  mockConfig
};
