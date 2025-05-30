# Engineering Pulse UI

This project serves as the comprehensive dashboard for engineering teams to track and analyze pull request metrics, providing valuable insights into team performance, code review processes, and overall delivery efficiency.

## About Engineering Pulse

Engineering Pulse is a metrics platform that helps engineering teams track and improve their software delivery performance by providing detailed metrics and insights about pull request workflows, contributor performance, and team collaboration patterns.

## Project Goals

- **Engineering Metrics Visibility**: Provide clear visibility into key engineering metrics to help teams improve their processes.
- **Contributor Performance**: Track individual and team performance across various metrics.
- **Pull Request Insights**: Offer detailed analysis of pull request lifecycle, review times, and bottlenecks.
- **Data-Driven Improvements**: Enable teams to make informed decisions based on real metrics rather than gut feelings.
- **Team Collaboration**: Highlight collaboration patterns and identify areas for improvement in review processes.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd engineering-pulse/ui
   ```

3. Install dependencies:
   ```
   npm install
   ```

## Development

Start the development server:

```
npm start
```

This will start a local development server at [http://localhost:3000](http://localhost:3000), and you can access the dashboard in your browser.

## Using Storybook

This project uses Storybook to document and showcase UI components in isolation.

1. Run Storybook development server:
   ```
   npm run storybook
   ```

2. Open Storybook in your browser at [http://localhost:6006](http://localhost:6006)

3. Browse components by category:
   - **Components**
     - Dashboard
     - Header
     - Contributors
     - Pull Requests
     - Charts
     - UI Elements

4. Build a static Storybook for deployment:
   ```
   npm run build-storybook
   ```
   This will create a `storybook-static` directory with deployable files.

## Building for Production

To build the application for production:

```
npm run build
```

This creates a `build` directory with optimized production files that can be deployed to any static hosting service.

## Deployment to S3

The application is designed to be hosted as a static website on Amazon S3.

1. Build the application:
   ```
   npm run build
   ```

2. Deploy the contents of the `build` directory to your S3 bucket:
   ```
   npm run deploy:s3
   ```
   Note: You may need to update the bucket name in package.json before running this command.

3. S3 bucket configuration:
   - Enable static website hosting
   - Set index document to `index.html`
   - Set error document to `index.html` (for SPA routing)
   - Configure appropriate bucket policies for public access

## Features

- **Dashboard Overview**: Shows key metrics such as total PRs, PRs merged, average cycle time, and more
- **Contributor Insights**: Displays reviewer activity, iteration counts, and top contributors
- **Pull Request Table**: Lists all PRs with detailed information and filtering options
- **Date Range Filtering**: Filter all metrics by a custom date range
- **URL-Based Navigation**: Access different views directly via URLs (e.g., /dashboard, /contributors, /pullrequests)
- **Browser History Support**: Proper back/forward navigation with URL-based routing
- **Bookmarkable Pages**: Users can bookmark specific views
- **Responsive Design**: Works on desktops, tablets, and mobile devices

## Project Structure

```
ui/
├── .storybook/            # Storybook configuration files
├── public/                # Public assets
├── src/
│   ├── components/        # React components
│   │   ├── Dashboard/     # Dashboard overview components
│   │   │   └── stories/   # Dashboard component stories
│   │   ├── Contributors/  # Contributor insights components
│   │   │   ├── charts/    # Chart components for contributors
│   │   │   ├── components/# UI components for contributors
│   │   │   ├── hooks/     # Custom hooks for contributors
│   │   │   └── sections/  # Page sections for contributors
│   │   ├── PullRequests/  # Pull request table components
│   │   ├── Header/        # Application header component
│   │   ├── Navigation/    # Navigation tabs component
│   │   ├── DateRangePicker/ # Date range picker component
│   │   └── shared/        # Shared UI components and icons
│   ├── config/            # Configuration files
│   ├── services/          # API service functions
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main application component
│   ├── App.css            # Main application styles
│   ├── index.js           # Application entry point
│   └── index.css          # Global styles
└── package.json           # Project dependencies and scripts
```

## Code Standards

This project adheres to the following code standards:

- **Component Structure**: Each component follows a consistent pattern with PropTypes validation
- **Hooks Usage**: Custom hooks for data fetching, state management, and side effects
- **Error Handling**: Consistent error states and retry mechanisms
- **Performance**: React.memo, useMemo, and useCallback for optimized renders
- **Accessibility**: ARIA attributes and keyboard navigation support
- **Documentation**: JSDoc comments for all components and functions

## API Integration

The application connects to the following API endpoints:

- `/api/pr-metrics/summary`: Fetches summary metrics for the dashboard overview
- `/api/pr-metrics/contributors`: Retrieves contributor-level metrics
- `/api/pr-metrics/table`: Gets detailed PR data for the table view

## Environment Variables

The application uses these environment variables:

- `REACT_APP_API_URL`: Base URL for API requests (defaults to local development server)
- `REACT_APP_DEFAULT_DAYS_RANGE`: Default number of days to show in date range (default: 30)

Create `.env.development` or `.env.production` files to set these values for different environments.

## Testing

Our project follows a comprehensive testing approach to ensure code quality and prevent regressions:

### Running Tests

Execute the test suite with:

```
npm test
```

This will run all tests and provide coverage information.

### Test Structure

- **Component Tests**: Each component has associated tests verifying its rendering and behavior
- **Utility Tests**: Utility functions have dedicated tests ensuring correct operation
- **Mock Configuration**: API calls are properly mocked during tests
- **Testing Libraries**: We use Jest as the test runner and React Testing Library for component testing

### Testing Guidelines

- All new features should include tests
- Aim for high test coverage on business logic and complex components
- Use snapshot testing for UI components where appropriate
- Write tests that verify behavior, not implementation details

## Technology Stack

- **React**: Frontend library for building the user interface
- **React Router**: For application routing
- **Axios**: For making API requests
- **Chart.js/React-Chartjs-2**: For data visualization
- **React-DatePicker**: For date range selection
- **Lucide React**: For UI icons
- **Storybook**: For component documentation and development
- **Jest**: For testing components and utilities

## Browser Support

The application is tested and supports the following browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

We welcome contributions to Engineering Pulse UI! If you're interested in contributing, please:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes and commit them with clear messages
4. Submit a pull request to the main branch

## License

[Apache](LICENSE)
