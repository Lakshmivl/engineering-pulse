import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import QEMetrics from './QEMetrics';
import { mockQEData } from './__mocks__/mockQEData';

// Mock Chart.js
jest.mock('chart.js', () => {
  const mockChart = jest.fn().mockImplementation(() => ({
    destroy: jest.fn(),
    update: jest.fn(),
    resize: jest.fn()
  }));
  
  mockChart.register = jest.fn();
  
  return {
    Chart: mockChart,
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
    DoughnutController: jest.fn()
  };
});

// Mock ChartDataLabels plugin
jest.mock('chartjs-plugin-datalabels', () => jest.fn());

// Mock the custom hook
jest.mock('./hooks/useQEData', () => ({
  __esModule: true,
  default: jest.fn()
}));

import useQEData from './hooks/useQEData';

describe('QEMetrics Component', () => {
  const defaultProps = {
    isoStartDate: '2025-06-01',
    isoEndDate: '2025-06-30',
    selectedRepository: 'all',
    refreshKey: 1
  };

  beforeEach(() => {
    // Reset the mock before each test
    useQEData.mockReset();
  });

  test('renders loading state', () => {
    useQEData.mockReturnValue({
      qeData: null,
      loading: true,
      error: null,
      refreshData: jest.fn()
    });

    render(<QEMetrics {...defaultProps} />);
    
    expect(screen.getByText('Loading QE metrics data...')).toBeInTheDocument();
  });

  test('renders error state', () => {
    useQEData.mockReturnValue({
      qeData: null,
      loading: false,
      error: 'Failed to fetch data',
      refreshData: jest.fn()
    });

    render(<QEMetrics {...defaultProps} />);
    
    expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
  });

  test('renders QE metrics with data', () => {
    useQEData.mockReturnValue({
      qeData: mockQEData,
      loading: false,
      error: null,
      refreshData: jest.fn()
    });

    render(<QEMetrics {...defaultProps} />);
    
    // Check for metric cards
    expect(screen.getByText('Repository with Highest Test Failure Rate')).toBeInTheDocument();
    expect(screen.getByText('Repository with Longest Average Test Duration')).toBeInTheDocument();
    expect(screen.getByText('Automation Coverage')).toBeInTheDocument();
    expect(screen.getByText('Flaky Runs')).toBeInTheDocument();
    
    // Check for chart titles
    expect(screen.getByText('Sprint Test Automation Results')).toBeInTheDocument();
    expect(screen.getByText('PR Delivery Performance Heatmap')).toBeInTheDocument();
  });

  test('displays correct metric values from mock data', () => {
    useQEData.mockReturnValue({
      qeData: mockQEData,
      loading: false,
      error: null,
      refreshData: jest.fn()
    });

    render(<QEMetrics {...defaultProps} />);
    
    // Check automation coverage percentage
    expect(screen.getByText('4.88%')).toBeInTheDocument();
    
    // Check flaky runs percentage
    expect(screen.getByText('0%')).toBeInTheDocument();
    
    // Check that the metric cards are rendered with correct titles
    expect(screen.getByText('Automation Coverage')).toBeInTheDocument();
    expect(screen.getByText('Flaky Runs')).toBeInTheDocument();
  });

  test('renders empty state when no data', () => {
    useQEData.mockReturnValue({
      qeData: null,
      loading: false,
      error: null,
      refreshData: jest.fn()
    });

    render(<QEMetrics {...defaultProps} />);
    
    expect(screen.getByText('No QE metrics data available for the selected date range')).toBeInTheDocument();
  });
});
