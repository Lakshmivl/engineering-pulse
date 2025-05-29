/**
 * Mock configuration
 * Contains mock data for development
 * Allows application to run without a backend API
 */

// Mock summary data
const MOCK_SUMMARY = {
  total_prs: 145,
  merged_prs: 122,
  avg_pr_size: 154,
  avg_review_time: "1 d 17 h",
  avg_cycle_time: 2.5,
  pr_to_prod: 98,
  loc_to_prod: 12340,
  repo_summary: {
    "it-web-aem-website": {
        "avg_pr_size": 136,
        "pr_count": 17,
        "avg_cycle_time": 118.98
    },
    "it-web-cart-checkout": {
        "avg_pr_size": 257,
        "pr_count": 3,
        "avg_cycle_time": 35.99
    },
    "it-web-payment-service": {
        "avg_pr_size": 4,
        "pr_count": 1,
        "avg_cycle_time": 12.84
    },
    "it-web-sap-commerce": {
        "avg_pr_size": 270,
        "pr_count": 3,
        "avg_cycle_time": 37.61
    },
    "it-web-services": {
        "avg_pr_size": 88,
        "pr_count": 3,
        "avg_cycle_time": 161.15
    }
  }
};

// Mock PR table data
const MOCK_PR_TABLE = [
  {
    rowNumber: 1,
    Jira_ID: 'ENG-123',
    Jira_URL: 'https://example.atlassian.net/browse/ENG-123',
    repository: 'frontend-app',
    PRNumber: 'PR-456',
    PR_URL: 'https://github.com/example/frontend-app/pull/456',
    State: 'Merged',
    ReviewRequestedTime: '2025-04-15T10:30:00Z',
    MergedDate: '2025-04-16T14:45:00Z',
    Author: 'Alex Kim'
  },
  {
    rowNumber: 2,
    Jira_ID: 'ENG-124',
    Jira_URL: 'https://example.atlassian.net/browse/ENG-124',
    repository: 'backend-service',
    PRNumber: 'PR-457',
    PR_URL: 'https://github.com/example/backend-service/pull/457',
    State: 'Review In Progress',
    ReviewRequestedTime: '2025-04-16T09:15:00Z',
    MergedDate: null,
    Author: 'Jordan Smith'
  },
  {
    rowNumber: 3,
    Jira_ID: 'ENG-125',
    Jira_URL: 'https://example.atlassian.net/browse/ENG-125',
    repository: 'api-gateway',
    PRNumber: 'PR-458',
    PR_URL: 'https://github.com/example/api-gateway/pull/458',
    State: 'Changes Requested',
    ReviewRequestedTime: '2025-04-17T11:45:00Z',
    MergedDate: null,
    Author: 'Taylor Jones'
  },
  {
    rowNumber: 4,
    Jira_ID: 'ENG-126',
    Jira_URL: 'https://example.atlassian.net/browse/ENG-126',
    repository: 'data-pipeline',
    PRNumber: 'PR-459',
    PR_URL: 'https://github.com/example/data-pipeline/pull/459',
    State: 'Merged',
    ReviewRequestedTime: '2025-04-18T14:30:00Z',
    MergedDate: '2025-04-19T09:20:00Z',
    Author: 'Morgan Chen'
  },
  {
    rowNumber: 5,
    Jira_ID: 'ENG-127',
    Jira_URL: 'https://example.atlassian.net/browse/ENG-127',
    repository: 'frontend-app',
    PRNumber: 'PR-460',
    PR_URL: 'https://github.com/example/frontend-app/pull/460',
    State: 'Open',
    ReviewRequestedTime: '2025-04-19T10:00:00Z',
    MergedDate: null,
    Author: 'Alex Kim'
  }
];

// Mock contributor data
const MOCK_CONTRIBUTORS = {
  top_reviewers: [
    { name: 'Jordan Smith', reviews: 28 },
    { name: 'Morgan Chen', reviews: 25 },
    { name: 'Alex Kim', reviews: 22 },
    { name: 'Taylor Jones', reviews: 19 }
  ],
  impactful_contributors: [
    { name: 'Alex Kim', prs_delivered: 35 },
    { name: 'Morgan Chen', prs_delivered: 28 },
    { name: 'Taylor Jones', prs_delivered: 24 },
    { name: 'Jordan Smith', prs_delivered: 20 }
  ],
  code_quality_champions: [
    { name: 'Morgan Chen', prs_flagged: 12 },
    { name: 'Jordan Smith', prs_flagged: 10 },
    { name: 'Taylor Jones', prs_flagged: 8 },
    { name: 'Alex Kim', prs_flagged: 6 }
  ],
  reviewer_iteration_chart: [
    { name: 'Jordan Smith', avg_iterations: 2.3 },
    { name: 'Morgan Chen', avg_iterations: 1.9 },
    { name: 'Alex Kim', avg_iterations: 2.1 },
    { name: 'Taylor Jones', avg_iterations: 1.7 }
  ],
  fastest_reviewers: [
    { name: 'Taylor Jones', avg_response_time_hrs: 3.2 },
    { name: 'Morgan Chen', avg_response_time_hrs: 4.1 },
    { name: 'Jordan Smith', avg_response_time_hrs: 4.8 },
    { name: 'Alex Kim', avg_response_time_hrs: 5.3 }
  ],
  cross_repo_champions: [
    { name: 'Morgan Chen', cross_repo_count: 8 },
    { name: 'Jordan Smith', cross_repo_count: 6 },
    { name: 'Taylor Jones', cross_repo_count: 5 },
    { name: 'Alex Kim', cross_repo_count: 3 }
  ],
  review_speed_chart: [
    { date: '2025-04-13', pr_volume: 12, avg_review_time_hrs: 5.2 },
    { date: '2025-04-14', pr_volume: 15, avg_review_time_hrs: 4.8 },
    { date: '2025-04-15', pr_volume: 10, avg_review_time_hrs: 6.1 },
    { date: '2025-04-16', pr_volume: 18, avg_review_time_hrs: 5.5 },
    { date: '2025-04-17', pr_volume: 14, avg_review_time_hrs: 4.9 },
    { date: '2025-04-18', pr_volume: 16, avg_review_time_hrs: 5.3 },
    { date: '2025-04-19', pr_volume: 12, avg_review_time_hrs: 4.7 }
  ]
};

export const mockConfig = {
  MOCK_SUMMARY,
  MOCK_PR_TABLE,
  MOCK_CONTRIBUTORS,
  
  // Function to simulate API delay
  getWithDelay: (mockData, delayMs = 100) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData);
      }, delayMs);
    });
  }
};

export default mockConfig;
