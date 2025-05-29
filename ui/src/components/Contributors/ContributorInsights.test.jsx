import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ContributorInsights from './ContributorInsights';

// Mock the custom hook
jest.mock('./hooks/useContributorData', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock the section components to simplify testing
jest.mock('./sections/TopReviewersSection', () => ({ topReviewers }) => <div data-testid="top-reviewers-section">Top Reviewers Mocked</div>);
jest.mock('./sections/TopContributorsSection', () => ({ impactfulContributors }) => <div data-testid="top-contributors-section">Top Contributors Mocked</div>);
jest.mock('./sections/CollaboratorsSection', () => ({ collaborators }) => <div data-testid="collaborators-section">Collaborators Mocked</div>);
jest.mock('./sections/ReviewSpeedSection', () => ({ reviewSpeedData }) => <div data-testid="review-speed-section">Review Speed Mocked</div>);
jest.mock('./sections/QualityChampionsSection', () => ({ qualityChampions }) => <div data-testid="quality-champions-section">Quality Champions Mocked</div>);
jest.mock('./sections/FastestReviewersSection', () => ({ fastestReviewers }) => <div data-testid="fastest-reviewers-section">Fastest Reviewers Mocked</div>);

import useContributorData from './hooks/useContributorData';

describe('ContributorInsights Component', () => {
  const mockRefreshData = jest.fn();
  
  const mockContributorData = {
    top_reviewers: [{id: 1, name: 'Reviewer 1'}],
    impactful_contributors: [{id: 1, name: 'Contributor 1'}],
    cross_repo_champions: [{id: 1, name: 'Collaborator 1'}],
    review_speed_chart: [{week: '2024-W1', count: 5, avg_time: 24}],
    code_quality_champions: [{id: 1, name: 'Quality Champ 1'}],
    fastest_reviewers: [{id: 1, name: 'Fast Reviewer 1'}],
  };
  
  const defaultProps = {
    isoStartDate: '2024-04-01',
    isoEndDate: '2024-04-30',
    refreshKey: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useContributorData.mockReturnValue({
      contributorData: mockContributorData,
      loading: false,
      error: null,
      refreshData: mockRefreshData,
    });
  });

  test('renders all contributor sections when data is available', () => {
    render(<ContributorInsights {...defaultProps} />);
    
    // Check that all sections are rendered
    expect(screen.getByTestId('top-reviewers-section')).toBeInTheDocument();
    expect(screen.getByTestId('top-contributors-section')).toBeInTheDocument();
    expect(screen.getByTestId('collaborators-section')).toBeInTheDocument();
    expect(screen.getByTestId('review-speed-section')).toBeInTheDocument();
    expect(screen.getByTestId('quality-champions-section')).toBeInTheDocument();
    expect(screen.getByTestId('fastest-reviewers-section')).toBeInTheDocument();
  });

  test('displays loading state when loading is true', () => {
    useContributorData.mockReturnValue({
      contributorData: null,
      loading: true,
      error: null,
      refreshData: mockRefreshData,
    });
    
    render(<ContributorInsights {...defaultProps} />);
    expect(screen.getByText('Loading contributor data...')).toBeInTheDocument();
  });

  test('displays error state when error exists', () => {
    const errorMessage = 'Failed to fetch data';
    useContributorData.mockReturnValue({
      contributorData: null,
      loading: false,
      error: errorMessage,
      refreshData: mockRefreshData,
    });
    
    render(<ContributorInsights {...defaultProps} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    
    // Test retry functionality
    const retryButton = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryButton);
    expect(mockRefreshData).toHaveBeenCalledTimes(1);
  });

  test('displays empty state when no data is available', () => {
    useContributorData.mockReturnValue({
      contributorData: null,
      loading: false,
      error: null,
      refreshData: mockRefreshData,
    });
    
    render(<ContributorInsights {...defaultProps} />);
    expect(screen.getByText('No contributor data available for the selected date range')).toBeInTheDocument();
  });

  test('passes date range to the hook correctly', () => {
    const customProps = {
      isoStartDate: '2024-01-01',
      isoEndDate: '2024-01-31',
      refreshKey: 2,
    };
    
    render(<ContributorInsights {...customProps} />);
    
    expect(useContributorData).toHaveBeenCalledWith(
      customProps.isoStartDate,
      customProps.isoEndDate,
      customProps.refreshKey
    );
  });
});
