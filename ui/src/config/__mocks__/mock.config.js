/**
 * Mock configuration for testing
 */

// Mock summary data for tests
export const MOCK_SUMMARY = {
  total_prs: 145,
  merged_prs: 122,
  avg_pr_size: 154
};

// Mock PR table data for tests
export const MOCK_PR_TABLE = [
  {
    rowNumber: 1,
    Jira_ID: 'TEST-123',
    repository: 'test-repo',
    PRNumber: 'PR-456',
    State: 'Merged',
    Author: 'Test User'
  }
];

// Mock contributor data for tests
export const MOCK_CONTRIBUTORS = {
  top_reviewers: [
    { name: 'Test User', reviews: 28 }
  ]
};

// Function to simulate API delay
export const getWithDelay = (mockData, delayMs = 10) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData);
    }, delayMs);
  });
};

export const mockConfig = {
  MOCK_SUMMARY,
  MOCK_PR_TABLE,
  MOCK_CONTRIBUTORS,
  getWithDelay
};

export default mockConfig;
