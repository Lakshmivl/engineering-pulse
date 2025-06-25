/**
 * Mock data for QE Metrics component testing
 * Based on the actual API response structure provided
 */

export const mockQEData = {
  "repos_with_automation_avg_duration": [
    {
      "repo": "it-web-sap-commerce",
      "avg_automation_duration_mins": 0
    },
    {
      "repo": "it-web-aem-website",
      "avg_automation_duration_mins": 79.04
    },
    {
      "repo": "it-web-services",
      "avg_automation_duration_mins": 126.48
    },
    {
      "repo": "it-web-api-automation",
      "avg_automation_duration_mins": 45.32
    },
    {
      "repo": "it-web-cart-checkout",
      "avg_automation_duration_mins": 67.89
    }
  ],
  "repos_with_failures": [
    {
      "repo": "it-web-aem-website",
      "failure_count": 8,
      "failure_percentage": 100
    },
    {
      "repo": "it-web-services",
      "failure_count": 1,
      "failure_percentage": 100
    },
    {
      "repo": "it-web-cart-checkout",
      "failure_count": 3,
      "failure_percentage": 75
    }
  ],
  "repo_with_longest_automation": {
    "repo": "it-web-services",
    "avg_automation_duration_mins": 126.48
  },
  "repo_with_highest_automation_failures": {
    "repo": "it-web-aem-website",
    "failure_count": 8,
    "failure_percentage": 100
  },
  "pr_delivery_heatmap": [
    {
      "repo": "it-web-api-automation",
      "merged_date": "2025-06-18T09:42:55Z"
    },
    {
      "repo": "it-web-services",
      "merged_date": "2025-06-18T18:11:23Z"
    },
    {
      "repo": "it-web-aem-website",
      "merged_date": "2025-06-19T02:15:49Z"
    },
    {
      "repo": "it-web-aem-website",
      "merged_date": "2025-06-19T14:48:23Z"
    },
    {
      "repo": "it-web-cart-checkout",
      "merged_date": "2025-06-19T14:57:41Z"
    },
    {
      "repo": "it-web-aem-website",
      "merged_date": "2025-06-19T10:07:58Z"
    },
    {
      "repo": "it-web-website-automation",
      "merged_date": "2025-06-19T14:52:56Z"
    },
    {
      "repo": "it-web-services",
      "merged_date": "2025-06-17T16:30:12Z"
    },
    {
      "repo": "it-web-api-automation",
      "merged_date": "2025-06-17T11:22:33Z"
    },
    {
      "repo": "it-web-cart-checkout",
      "merged_date": "2025-06-16T13:45:18Z"
    },
    {
      "repo": "it-web-aem-website",
      "merged_date": "2025-06-16T09:15:27Z"
    },
    {
      "repo": "it-web-website-automation",
      "merged_date": "2025-06-15T15:33:44Z"
    }
  ]
};

export const mockEmptyQEData = {
  "repos_with_automation_avg_duration": [],
  "repos_with_failures": [],
  "repo_with_longest_automation": null,
  "repo_with_highest_automation_failures": null,
  "pr_delivery_heatmap": []
};

export const mockQEDataWithErrors = {
  "repos_with_automation_avg_duration": null,
  "repos_with_failures": undefined,
  "repo_with_longest_automation": {},
  "repo_with_highest_automation_failures": {},
  "pr_delivery_heatmap": null
};

// Mock data for different date ranges
export const mockQEDataExtended = {
  ...mockQEData,
  "pr_delivery_heatmap": [
    ...mockQEData.pr_delivery_heatmap,
    // Add more historical data for testing heatmap
    {
      "repo": "it-web-services",
      "merged_date": "2025-06-14T10:20:15Z"
    },
    {
      "repo": "it-web-services",
      "merged_date": "2025-06-14T14:35:22Z"
    },
    {
      "repo": "it-web-aem-website",
      "merged_date": "2025-06-13T08:45:33Z"
    },
    {
      "repo": "it-web-api-automation",
      "merged_date": "2025-06-12T16:12:44Z"
    },
    {
      "repo": "it-web-cart-checkout",
      "merged_date": "2025-06-11T12:28:55Z"
    }
  ]
};

export default mockQEData;
