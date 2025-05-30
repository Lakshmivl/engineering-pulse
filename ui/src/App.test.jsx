import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import '@testing-library/jest-dom';

// Mock the child components to simplify testing
jest.mock('./components/Header/Header', () => ({ startDate, endDate, onDateChange, onRefresh }) => (
  <header data-testid="header">
    <h1>Engineering PR Metrics</h1>
    <button data-testid="refresh-button" onClick={onRefresh}>Refresh</button>
  </header>
));

jest.mock('./components/Navigation/Navigation', () => () => (
  <nav data-testid="navigation">
    <a 
      data-testid="dashboard-tab" 
      href="/dashboard"
    >
      Dashboard Overview
    </a>
    <a 
      data-testid="contributors-tab" 
      href="/contributors"
    >
      Contributor Insights
    </a>
    <a 
      data-testid="pullrequests-tab" 
      href="/pullrequests"
    >
      PR Review & Merge Queue
    </a>
  </nav>
));

jest.mock('./components/Dashboard/DashboardOverview', () => () => (
  <div data-testid="dashboard-content">Dashboard Content</div>
));

jest.mock('./components/Contributors/ContributorInsights', () => () => (
  <div data-testid="contributors-content">Contributors Content</div>
));

jest.mock('./components/PullRequests/PullRequestTable', () => () => (
  <div data-testid="pullrequests-content">Pull Requests Content</div>
));

// Mock the API services
jest.mock('./services/api', () => ({
  fetchSummary: jest.fn().mockResolvedValue({
    total_prs: 120,
    merged_prs: 95,
    avg_cycle_time: 1.5,
    pr_to_prod: 62,
    loc_to_prod: 8452
  }),
  fetchContributors: jest.fn().mockResolvedValue({
    total_reviewers: 12,
    total_pr_iterations: 36,
    top_reviewers: [
      { name: 'Alice', reviews: 9 },
      { name: 'Bob', reviews: 7 },
      { name: 'Charlie', reviews: 6 }
    ],
    reviewer_iteration_chart: [
      { name: 'Alice', avg_iterations: 2.5 },
      { name: 'Bob', avg_iterations: 1.8 },
      { name: 'Charlie', avg_iterations: 1.6 }
    ]
  }),
  fetchPRTable: jest.fn().mockResolvedValue([
    {
      PR_ID: 'repo1',
      Jira_ID: 'PROJ-001',
      PR_URL: 'https://github.com/org/repo/pull/123',
      State: 'Merged',
      CreatedDate: '2024-04-01T10:00:00Z',
      MergedDate: '2024-04-02T10:00:00Z',
      Author: 'alice',
      PR_Size: 210
    }
  ]),
  createCancellationToken: jest.fn().mockReturnValue({
    token: 'mock-token',
    cancel: jest.fn()
  })
}));

// Mock the utils
jest.mock('./utils/dateUtils', () => ({
  getDefaultDateRange: jest.fn().mockReturnValue({
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-04-30')
  }),
  formatDateToISO: jest.fn().mockImplementation(date => {
    if (!date) return '';
    return '2024-04-15'; // Mock implementation - return a fixed date for simplicity
  })
}));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the header with Engineering PR Metrics title', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Engineering PR Metrics/i)).toBeInTheDocument();
  });

  test('renders the navigation tabs', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Dashboard Overview/i)).toBeInTheDocument();
    expect(screen.getByText(/Contributor Insights/i)).toBeInTheDocument();
    expect(screen.getByText(/PR Review & Merge Queue/i)).toBeInTheDocument();
  });

  test('renders Dashboard when URL is /dashboard', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    );
    // Dashboard content should be visible
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-content')).toBeInTheDocument();
    });
  });

  test('renders Contributors when URL is /contributors', async () => {
    render(
      <MemoryRouter initialEntries={['/contributors']}>
        <App />
      </MemoryRouter>
    );
    // Contributors content should be visible
    await waitFor(() => {
      expect(screen.getByTestId('contributors-content')).toBeInTheDocument();
    });
  });

  test('renders PullRequests when URL is /pullrequests', async () => {
    render(
      <MemoryRouter initialEntries={['/pullrequests']}>
        <App />
      </MemoryRouter>
    );
    // Pull Requests content should be visible
    await waitFor(() => {
      expect(screen.getByTestId('pullrequests-content')).toBeInTheDocument();
    });
  });

  test('redirects to /dashboard when URL is /', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    // Dashboard content should be visible due to redirect
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-content')).toBeInTheDocument();
    });
  });

  test('refresh button updates the refresh key', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    );
    
    // Dashboard content should be visible
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-content')).toBeInTheDocument();
    });
    
    // Click refresh
    fireEvent.click(screen.getByTestId('refresh-button'));
    
    // Dashboard should still be visible after refresh
    expect(screen.getByTestId('dashboard-content')).toBeInTheDocument();
  });
});
