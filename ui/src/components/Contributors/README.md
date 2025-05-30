# Contributor Insights Component

This directory contains components for the Contributors section of the Engineering PR Metrics dashboard. The component hierarchy is designed for modularity, reusability, and maintainability.

## Component Structure

```
Contributors/
├── ContributorInsights.jsx        # Main container component
├── ContributorInsights.test.jsx   # Component tests
├── Contributors.css               # Styles for contributor components
├── charts/                        # Chart components
│   ├── DoughnutChartWithLegend.jsx
│   ├── HorizontalBarChart.jsx
│   ├── MixedChart.jsx
│   └── stories/                   # Storybook stories
├── components/                    # Reusable UI components
│   ├── AvatarList.jsx
│   ├── TableDisplay.jsx
│   └── Widget.jsx
├── hooks/                         # Custom hooks
│   └── useContributorData.js 
├── sections/                      # Page sections
│   ├── CollaboratorsSection.jsx
│   ├── FastestReviewersSection.jsx
│   ├── QualityChampionsSection.jsx
│   ├── ReviewSpeedSection.jsx
│   ├── TopContributorsSection.jsx
│   └── TopReviewersSection.jsx
└── utils/                         # Utility functions
    └── chartDataUtils.js
```

## Usage

The main component is `ContributorInsights.jsx` which loads and displays all contributor metrics. It takes the following props:

- `isoStartDate`: ISO formatted start date for the date range
- `isoEndDate`: ISO formatted end date for the date range
- `refreshKey`: A value that changes to trigger data refresh

Example:

```jsx
import ContributorInsights from './components/Contributors/ContributorInsights';

<ContributorInsights
  isoStartDate="2023-01-01"
  isoEndDate="2023-01-31"
  refreshKey={refreshKey}
/>
```

## Key Features

1. **Data Loading & Error Handling**: Centralized data loading with consistent error handling
2. **Modular Sections**: Individual sections for different metrics
3. **Reusable Charts**: Chart components that can be used across the application
4. **Custom Hooks**: Hooks for data fetching and manipulation
5. **Responsive Design**: Adapts to different screen sizes

## Extending

To add a new section to the Contributor Insights:

1. Create a new component in the `sections/` directory
2. Import and add it to the `ContributorInsights.jsx` component
3. Add any necessary data processing in the `hooks/useContributorData.js` file
4. Add any new chart utilities to the `utils/chartDataUtils.js` file

## Testing

Run tests with:

```
npm test src/components/Contributors
```

## Storybook

View component stories by running:

```
npm run storybook
```

The stories for chart components are located in the `charts/stories/` directory.
