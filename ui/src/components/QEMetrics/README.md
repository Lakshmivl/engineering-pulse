# QE Metrics Component

The QE Metrics component displays quality engineering and test automation metrics for repositories, providing insights into test performance, failure rates, and PR delivery patterns.

## Features

### Metric Cards
- **Most Failing Repository**: Shows the repository with the highest number of automation failures
- **Slowest Test Repository**: Displays the repository with the longest average automation duration

### Charts
- **Test Automation Duration by Repository**: Bar chart showing average automation runtime in minutes
- **Test Failures by Repository**: Bar chart displaying failure counts with percentage information in tooltips
- **PR Delivery Performance Heatmap**: Visual heatmap showing daily PR merge activity by repository

## Data Structure

The component expects data in the following format:

```javascript
{
  "repos_with_automation_avg_duration": [
    {
      "repo": "repository-name",
      "avg_automation_duration_mins": 126.48
    }
  ],
  "repos_with_failures": [
    {
      "repo": "repository-name",
      "failure_count": 8,
      "failure_percentage": 100
    }
  ],
  "repo_with_longest_automation": {
    "repo": "repository-name",
    "avg_automation_duration_mins": 126.48
  },
  "repo_with_highest_automation_failures": {
    "repo": "repository-name",
    "failure_count": 8,
    "failure_percentage": 100
  },
  "pr_delivery_heatmap": [
    {
      "repo": "repository-name",
      "developer": "developer-name",
      "merged_date": "2025-06-19T14:48:23Z"
    }
  ]
}
```

## Props

- `isoStartDate` (string, required): ISO formatted start date for the date range
- `isoEndDate` (string, required): ISO formatted end date for the date range
- `refreshKey` (number, required): Numeric key that changes to trigger a data refresh

## Usage

```jsx
import QEMetrics from './components/QEMetrics/QEMetrics';

<QEMetrics 
  isoStartDate="2025-05-20T00:00:00Z"
  isoEndDate="2025-06-19T23:59:59Z"
  refreshKey={0}
/>
```

## Components Structure

```
QEMetrics/
├── QEMetrics.jsx          # Main component
├── QEMetrics.css          # Styles
├── README.md              # Documentation
├── hooks/
│   └── useQEData.js       # Data fetching hook
├── utils/
│   └── qeDataTransformers.js  # Data transformation utilities
└── __mocks__/
    └── mockQEData.js      # Mock data for testing
```

## Heatmap Features

The heatmap component includes:
- Date filtering based on selected date range
- Color intensity based on PR count per day
- Hover tooltips showing repository, date, PR count, and developer names
- Responsive design for different screen sizes
- Legend showing color scale

## Styling

The component uses CSS Grid for responsive layouts and includes:
- Mobile-responsive design
- Hover effects and transitions
- Accessibility features
- Print-friendly styles

## API Integration

The component fetches data from the `/api/pr-metrics/qe` endpoint with the following parameters:
- `request_type`: 'qemetrics'
- `start_date`: ISO formatted start date
- `end_date`: ISO formatted end date
