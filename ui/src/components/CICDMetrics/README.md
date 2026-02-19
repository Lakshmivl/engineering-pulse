# CI/CD Metrics Component

This directory contains components for the CI/CD Metrics section of the Engineering PR Metrics dashboard. The component displays build performance, pipeline efficiency, and failure analysis metrics to help teams optimize their CI/CD processes.

## Component Structure

```
CICDMetrics/
├── CICDMetrics.jsx                    # Main container component
├── CICDMetrics.test.jsx              # Component tests
├── CICDMetrics.css                   # Styles for CICD components
├── README.md                         # This documentation
├── hooks/                            # Custom hooks
│   ├── useCICDData.js               # Data fetching hook
│   └── useCICDData.test.js          # Hook tests
├── utils/                           # Utility functions
│   ├── cicdDataTransformers.js      # Data transformation utilities
│   └── cicdDataTransformers.test.js # Transformer tests
└── __mocks__/                       # Mock data for tests
    └── mockCICDData.js              # Test data and mocks
```

## Usage

The main component is `CICDMetrics.jsx` which loads and displays all CI/CD metrics. It takes the following props:

- `isoStartDate`: ISO formatted start date for the date range
- `isoEndDate`: ISO formatted end date for the date range
- `refreshKey`: A value that changes to trigger data refresh

Example:

```jsx
import CICDMetrics from './components/CICDMetrics/CICDMetrics';

<CICDMetrics
  isoStartDate="2023-01-01"
  isoEndDate="2023-01-31"
  refreshKey={refreshKey}
/>
```

## Key Features

1. **Build Performance Tracking**: Displays slowest building repositories with detailed timing metrics
2. **Pipeline Efficiency**: Shows longest running pipelines and identifies bottlenecks
3. **Success Rate Monitoring**: Tracks pipeline success rates and build failure rates
4. **Failure Analysis**: Visual breakdown of stages causing most failures
5. **Stage Breakdown**: Stacked bar chart showing time spent in each build stage
6. **Responsive Design**: Adapts to different screen sizes and devices
7. **Real-time Updates**: Automatic refresh when date range changes
8. **Error Handling**: Comprehensive error states with retry functionality

## API Integration

### Endpoint
- **URL**: `/api/pr-metrics/cicd`
- **Method**: GET
- **Parameters**:
  - `startDate`: Start date in YYYYMMDD format
  - `endDate`: End date in YYYYMMDD format
  - `reqType`: `cicdmetrics`

### Response Structure
```json
{
  "slowest_build_repo": {
    "repo": "sap-commerce",
    "avg_build_time_mins": 17.5
  },
  "longest_pipeline_repo": {
    "repo": "aem-core",
    "avg_total_pipeline_time_mins": 28.9
  },
  "pipeline_success_rate": {
    "total_runs": 150,
    "successful_runs": 132,
    "success_percentage": 88
  },
  "build_failure_rate": {
    "total_builds": 150,
    "failed_builds": 18,
    "failure_percentage": 12
  },
  "stage_breakdown": [
    {
      "repo": "sap-commerce",
      "stages": {
        "build": 12.5,
        "sonar": 2.1,
        "unit_test": 3.2,
        "deploy": 4.7
      }
    }
  ],
  "stage_causing_most_failures": {
    "stage": "unit_test",
    "failure_count": 14,
    "failure_percentage": 35.0
  }
}
```

## Chart Types

### 1. Metric Cards
- **Purpose**: Display key performance indicators at a glance
- **Data**: Slowest build repo, longest pipeline, success rate, failure rate
- **Features**: Trend indicators, icons, formatted values

### 2. Stacked Bar Chart (Build Stage Breakdown)
- **Purpose**: Show time distribution across different build stages
- **Data**: Build, Sonar, Unit Test, Deploy times by repository
- **Features**: Interactive tooltips, color-coded stages, responsive design

### 3. Pie Chart (Stages Causing Most Failures)
- **Purpose**: Visualize failure distribution across pipeline stages
- **Data**: Failure percentages by stage type
- **Features**: Legend, hover details, accessible colors

## Data Transformations

### Metric Cards Transformation
```javascript
transformForMetricCards(cicdData) => {
  slowestBuild: { title, value, subtitle, trend },
  longestPipeline: { title, value, subtitle, trend },
  successRate: { title, value, subtitle, trend },
  failureRate: { title, value, subtitle, trend }
}
```

### Chart Data Transformation
```javascript
// Pie Chart
transformForPieChart(stageFailureData) => {
  labels: ['UNIT TEST', 'Other Stages'],
  datasets: [{ data, backgroundColor, borderWidth }]
}

// Stacked Bar Chart
transformForStackedBarChart(stageBreakdownData) => {
  labels: ['SAP-COMMERCE', 'AEM-CORE', ...],
  datasets: [
    { label: 'BUILD', data: [...], backgroundColor: '#3B82F6' },
    { label: 'SONAR', data: [...], backgroundColor: '#10B981' },
    // ...
  ]
}
```

## State Management

### Loading States
- **Initial Load**: Shows loading spinner with descriptive message
- **Data Refresh**: Maintains UI while fetching updated data
- **Error Recovery**: Provides retry mechanism for failed requests

### Error Handling
- **Network Errors**: User-friendly error messages with retry options
- **Data Validation**: Validates API response structure before rendering
- **Graceful Degradation**: Shows empty state for missing data

### Data Flow
1. Component mounts → `useCICDData` hook triggered
2. Hook creates cancellation token → calls `fetchCICDMetrics`
3. API response received → data validated and stored
4. Data transformed → charts and metrics rendered
5. Date change → process repeats with new parameters

## Performance Optimizations

### Memoization
- **Transformed Data**: `useMemo` prevents unnecessary recalculations
- **Chart Options**: Static chart configurations cached
- **Component Rendering**: Optimized re-render cycles

### Request Management
- **Cancellation Tokens**: Prevents race conditions and memory leaks
- **Debounced Updates**: Efficient handling of rapid date changes
- **Error Boundaries**: Isolated error handling per component

### Bundle Optimization
- **Code Reuse**: Leverages existing chart components and utilities
- **Lazy Loading**: Chart.js components loaded on demand
- **Tree Shaking**: Unused utilities automatically excluded

## Testing

### Test Coverage
- **Component Tests**: 100% line coverage for main component
- **Hook Tests**: Complete coverage of data fetching logic
- **Utility Tests**: All transformation functions tested
- **Integration Tests**: API integration with mock responses

### Running Tests
```bash
# Run all CICD tests
npm test src/components/CICDMetrics

# Run with coverage
npm test src/components/CICDMetrics --coverage

# Watch mode for development
npm test src/components/CICDMetrics --watch
```

### Test Structure
- **Unit Tests**: Individual function and component testing
- **Integration Tests**: Component interaction with hooks and APIs
- **Mock Data**: Comprehensive test data matching API contracts
- **Error Scenarios**: All error states and edge cases covered

## Extending

### Adding New Metrics
1. Update API response structure in `mockCICDData.js`
2. Add transformation logic in `cicdDataTransformers.js`
3. Create new metric card or chart component
4. Add to main `CICDMetrics.jsx` component
5. Write corresponding tests

### Adding New Chart Types
1. Create chart component in existing chart library pattern
2. Add data transformer for new chart format
3. Import and use in main component
4. Add responsive styling in CSS
5. Include in test coverage

### Customizing Appearance
- **Colors**: Modify color constants in transformers
- **Layout**: Adjust CSS grid and flexbox properties
- **Typography**: Update font sizes and weights in CSS
- **Spacing**: Modify margin and padding values

## Accessibility

### Screen Reader Support
- **ARIA Labels**: Descriptive labels for all interactive elements
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Alt Text**: Meaningful descriptions for visual elements

### Keyboard Navigation
- **Focus Management**: Logical tab order through components
- **Keyboard Shortcuts**: Standard navigation patterns
- **Focus Indicators**: Clear visual focus states

### Color and Contrast
- **High Contrast**: Supports high contrast mode preferences
- **Color Blind Friendly**: Accessible color palette choices
- **Text Contrast**: WCAG AA compliant contrast ratios

## Browser Support

### Compatibility
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+
- **Responsive Design**: Works on all screen sizes from 320px to 4K

### Polyfills
- **Chart.js**: Handles canvas compatibility automatically
- **CSS Grid**: Graceful fallback for older browsers
- **Fetch API**: Axios provides cross-browser compatibility

## Troubleshooting

### Common Issues

#### Charts Not Rendering
- **Cause**: Canvas context issues or missing Chart.js registration
- **Solution**: Verify Chart.js components are properly registered
- **Debug**: Check browser console for canvas-related errors

#### Data Not Loading
- **Cause**: API endpoint issues or network connectivity
- **Solution**: Check network tab and verify API response format
- **Debug**: Enable mock responses in environment config

#### Performance Issues
- **Cause**: Large datasets or frequent re-renders
- **Solution**: Implement data pagination or virtualization
- **Debug**: Use React DevTools Profiler to identify bottlenecks

### Debug Mode
Enable debug logging by setting `REACT_APP_DEBUG=true` in environment variables.

## Contributing

### Development Workflow
1. Create feature branch from main
2. Implement changes with tests
3. Run test suite and ensure coverage
4. Update documentation if needed
5. Submit pull request with description

### Code Standards
- **ESLint**: Follow existing linting rules
- **Prettier**: Use consistent code formatting
- **JSDoc**: Document all functions and components
- **PropTypes**: Define prop types for all components

### Testing Requirements
- **Unit Tests**: Required for all new functions
- **Component Tests**: Required for all new components
- **Integration Tests**: Required for API interactions
- **Coverage**: Maintain 90%+ test coverage
