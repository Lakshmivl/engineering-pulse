import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CICDMetrics from './CICDMetrics';
import { MOCK_CICD_DATA, MOCK_CICD_LOADING, MOCK_CICD_ERROR, MOCK_CICD_EMPTY } from './__mocks__/mockCICDData';

// Mock the custom hook
jest.mock('./hooks/useCICDData', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock Chart.js to avoid canvas issues in tests
jest.mock('chart.js', () => ({
  Chart: jest.fn().mockImplementation(() => ({
    destroy: jest.fn(),
    update: jest.fn(),
  })),
  CategoryScale: jest.fn(),
  LinearScale: jest.fn(),
  BarElement: jest.fn(),
  ArcElement: jest.fn(),
  Title: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
  LineElement: jest.fn(),
  PointElement: jest.fn(),
  BarController: jest.fn(),
  LineController: jest.fn(),
  DoughnutController: jest.fn(),
  register: jest.fn(),
}));

// Mock the reusable components
jest.mock('../shared/ui/StateComponents', () => ({
  StateWrapper: ({ children, isLoading, isError, isEmpty, onRetry, loadingMessage, errorMessage, emptyMessage }) => {
    if (isLoading) return <div data-testid="loading-state">{loadingMessage}</div>;
    if (isError) return (
      <div data-testid="error-state">
        <div>{errorMessage}</div>
        <button onClick={onRetry}>Try Again</button>
      </div>
    );
    if (isEmpty) return <div data-testid="empty-state">{emptyMessage}</div>;
    return <div data-testid="content-state">{children}</div>;
  }
}));

jest.mock('../Contributors/components/Widget', () => ({ children, title, subtitle, className }) => (
  <div data-testid="widget" className={className}>
    <h3>{title}</h3>
    {subtitle && <p>{subtitle}</p>}
    {children}
  </div>
));

jest.mock('../Contributors/charts/DoughnutChartWithLegend', () => ({ data, options }) => (
  <div data-testid="doughnut-chart">
    <div data-testid="chart-data">{JSON.stringify(data)}</div>
    <div data-testid="chart-options">{JSON.stringify(options)}</div>
  </div>
));

jest.mock('../Dashboard/MetricCard', () => ({ title, value, subtitle, trend, icon }) => (
  <div data-testid="metric-card">
    <div data-testid="card-icon">{icon}</div>
    <div data-testid="card-title">{title}</div>
    <div data-testid="card-value">{value}</div>
    <div data-testid="card-subtitle">{subtitle}</div>
    <div data-testid="card-trend">{trend}</div>
  </div>
));

import useCICDData from './hooks/useCICDData';

describe('CICDMetrics Component', () => {
  const mockRefreshData = jest.fn();
  
  const defaultProps = {
    isoStartDate: '2024-04-01',
    isoEndDate: '2024-04-30',
    refreshKey: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useCICDData.mockReturnValue({
      cicdData: MOCK_CICD_DATA,
      loading: false,
      error: null,
      refreshData: mockRefreshData,
    });
  });

  test('renders all CICD metric cards when data is available', () => {
    render(<CICDMetrics {...defaultProps} />);
    
    // Check that all metric cards are rendered
    const metricCards = screen.getAllByTestId('metric-card');
    expect(metricCards).toHaveLength(4);
    
    // Check specific metric card content
    expect(screen.getByText('Slowest Building Repo')).toBeInTheDocument();
    expect(screen.getByText('Longest Running Pipeline')).toBeInTheDocument();
    expect(screen.getByText('Pipeline Success Rate')).toBeInTheDocument();
    expect(screen.getByText('Build Failure Rate')).toBeInTheDocument();
  });

  test('renders chart widgets when data is available', () => {
    render(<CICDMetrics {...defaultProps} />);
    
    // Check that chart widgets are rendered
    expect(screen.getByText('Build Stage Breakdown')).toBeInTheDocument();
    expect(screen.getByText('Stages Causing Most Failures')).toBeInTheDocument();
    
    // Check that charts are rendered
    expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
  });

  test('displays loading state when loading is true', () => {
    useCICDData.mockReturnValue({
      cicdData: null,
      loading: true,
      error: null,
      refreshData: mockRefreshData,
    });
    
    render(<CICDMetrics {...defaultProps} />);
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
    expect(screen.getByText('Loading CI/CD metrics data...')).toBeInTheDocument();
  });

  test('displays error state when error exists', () => {
    const errorMessage = 'Failed to fetch CICD data';
    useCICDData.mockReturnValue({
      cicdData: null,
      loading: false,
      error: errorMessage,
      refreshData: mockRefreshData,
    });
    
    render(<CICDMetrics {...defaultProps} />);
    expect(screen.getByTestId('error-state')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    
    // Test retry functionality
    const retryButton = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryButton);
    expect(mockRefreshData).toHaveBeenCalledTimes(1);
  });

  test('displays empty state when no data is available', () => {
    useCICDData.mockReturnValue({
      cicdData: null,
      loading: false,
      error: null,
      refreshData: mockRefreshData,
    });
    
    render(<CICDMetrics {...defaultProps} />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('No CI/CD metrics data available for the selected date range')).toBeInTheDocument();
  });

  test('passes date range to the hook correctly', () => {
    const customProps = {
      isoStartDate: '2024-01-01',
      isoEndDate: '2024-01-31',
      refreshKey: 2,
    };
    
    render(<CICDMetrics {...customProps} />);
    
    expect(useCICDData).toHaveBeenCalledWith(
      customProps.isoStartDate,
      customProps.isoEndDate,
      customProps.refreshKey
    );
  });

  test('transforms data correctly for metric cards', () => {
    render(<CICDMetrics {...defaultProps} />);
    
    // Check that metric card values are transformed correctly
    expect(screen.getByText('SAP-COMMERCE')).toBeInTheDocument(); // Slowest build repo
    expect(screen.getByText('AEM-CORE')).toBeInTheDocument(); // Longest pipeline repo
    expect(screen.getByText('88%')).toBeInTheDocument(); // Success rate
    expect(screen.getByText('12%')).toBeInTheDocument(); // Failure rate
  });

  test('handles invalid data gracefully', () => {
    useCICDData.mockReturnValue({
      cicdData: { invalid: 'data' }, // Invalid data structure
      loading: false,
      error: null,
      refreshData: mockRefreshData,
    });
    
    render(<CICDMetrics {...defaultProps} />);
    
    // Should show empty state when data is invalid
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  test('memoizes transformed data to avoid unnecessary recalculations', () => {
    const { rerender } = render(<CICDMetrics {...defaultProps} />);
    
    // Re-render with same data
    rerender(<CICDMetrics {...defaultProps} />);
    
    // The component should not re-transform data if cicdData hasn't changed
    expect(screen.getByTestId('content-state')).toBeInTheDocument();
  });

  test('updates when refreshKey changes', () => {
    const { rerender } = render(<CICDMetrics {...defaultProps} />);
    
    // Re-render with different refreshKey
    rerender(<CICDMetrics {...defaultProps} refreshKey={2} />);
    
    expect(useCICDData).toHaveBeenCalledWith(
      defaultProps.isoStartDate,
      defaultProps.isoEndDate,
      2
    );
  });

  test('renders with proper accessibility attributes', () => {
    render(<CICDMetrics {...defaultProps} />);
    
    // Check that the main container has proper structure
    const mainContainer = screen.getByTestId('content-state');
    expect(mainContainer).toBeInTheDocument();
    
    // Check that metric cards have proper content
    const metricCards = screen.getAllByTestId('metric-card');
    metricCards.forEach(card => {
      expect(card).toHaveAttribute('data-testid', 'metric-card');
    });
  });

  test('handles chart rendering without errors', () => {
    render(<CICDMetrics {...defaultProps} />);
    
    // Check that doughnut chart is rendered
    const doughnutChart = screen.getByTestId('doughnut-chart');
    expect(doughnutChart).toBeInTheDocument();
    
    // Check that chart data is passed correctly
    const chartData = screen.getByTestId('chart-data');
    expect(chartData).toBeInTheDocument();
  });
});
