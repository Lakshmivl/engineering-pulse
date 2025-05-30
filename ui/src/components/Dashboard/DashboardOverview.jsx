import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchSummary, createCancellationToken } from '../../services/api';
import MetricCard from './MetricCard';

import { StateWrapper, MetricsLoadingSkeleton } from '../shared/ui/StateComponents';
import MixedChart from '../Contributors/charts/MixedChart';
import { 
  TotalPRsIcon, 
  PRsMergedIcon, 
  CycleTimeIcon,
  PRsToProductionIcon,
  LoCToProductionIcon,
  ReviewTimeIcon,
  PRSizeIcon
} from '../shared/icons/MetricIcons';
import './Dashboard.css';

/**
 * Prepares repository summary data for the mixed chart visualization
 * @param {Object} repoSummary - Repository summary data from API
 * @returns {Object} Formatted data for the MixedChart component
 */
const prepareRepoSummaryChartData = (repoSummary) => {
  if (!repoSummary || Object.keys(repoSummary).length === 0) {
    return {
      data: {
        labels: ['No data available'],
        datasets: [
          {
            type: 'bar',
            label: 'PR Count',
            data: [0],
            backgroundColor: 'rgba(38, 166, 154, 0.9)',
            borderColor: 'rgba(38, 166, 154, 1)',
            borderWidth: 1,
            order: 1,
          },
          {
            type: 'bar',
            label: 'Avg PR Size',
            data: [0],
            backgroundColor: 'rgba(239, 83, 80, 0.9)',
            borderColor: 'rgba(239, 83, 80, 1)',
            borderWidth: 1,
            order: 1,
          },
          {
            type: 'line',
            label: 'Avg Cycle Time (hrs)',
            data: [0],
            borderColor: 'rgba(66, 133, 244, 1)',
            backgroundColor: 'rgba(66, 133, 244, 0.2)',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: 'rgba(66, 133, 244, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 1,
            yAxisID: 'y1',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false,
            },
            title: {
              display: true,
              text: 'Repository',
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            },
            title: {
              display: true,
              text: 'Count / Size',
            },
            ticks: {
              precision: 0,
            },
          },
          y1: {
            beginAtZero: true,
            position: 'right',
            grid: {
              display: false,
            },
            title: {
              display: true,
              text: 'Cycle Time (hrs)',
            },
            ticks: {
              precision: 0,
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'center',
            labels: {
              boxWidth: 12,
              usePointStyle: false,
              padding: 15,
            },
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
      },
      hasData: false
    };
  }

  // Extract repositories and their data
  const repositories = Object.keys(repoSummary);
  const prCounts = repositories.map(repo => repoSummary[repo].pr_count);
  const prSizes = repositories.map(repo => repoSummary[repo].avg_pr_size);
  const cycleTimes = repositories.map(repo => repoSummary[repo].avg_cycle_time);

  // Create chart data
  return {
    data: {
      labels: repositories,
      datasets: [
        {
          type: 'bar',
          label: 'PR Count',
          data: prCounts,
          backgroundColor: 'rgba(38, 166, 154, 0.9)', // Teal
          borderColor: 'rgba(38, 166, 154, 1)',
          borderWidth: 1,
          order: 1,
        },
        {
          type: 'bar',
          label: 'Avg PR Size',
          data: prSizes,
          backgroundColor: 'rgba(142, 68, 173, 0.9)', // Purple
          borderColor: 'rgba(142, 68, 173, 1)',
          borderWidth: 1,
          order: 1,
        },
        {
          type: 'line',
          label: 'Avg Cycle Time (hrs)',
          data: cycleTimes,
          borderColor: 'rgba(66, 133, 244, 1)', // Blue
          backgroundColor: 'rgba(66, 133, 244, 0.2)',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: 'rgba(66, 133, 244, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 1,
          yAxisID: 'y1',
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false,
          },
          title: {
            display: true,
            text: 'Repository',
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
          },
          title: {
            display: true,
            text: 'Count / Size',
          },
          ticks: {
            precision: 0,
          },
        },
        y1: {
          beginAtZero: true,
          position: 'right',
          grid: {
            display: false,
          },
          title: {
            display: true,
            text: 'Cycle Time (hrs)',
          },
          ticks: {
            precision: 0,
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'center',
          labels: {
            boxWidth: 12,
            usePointStyle: false,
            padding: 15,
          },
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
    },
    hasData: repositories.length > 0
  };
};

/**
 * DashboardOverview component for displaying summary metrics
 * @param {Object} props - Component props
 * @param {Date} props.startDate - Start date for filtering
 * @param {Date} props.endDate - End date for filtering
 * @param {string} props.isoStartDate - ISO formatted start date
 * @param {string} props.isoEndDate - ISO formatted end date
 * @param {number} props.refreshKey - Numeric key that changes to trigger a data refresh in the component
 */
const DashboardOverview = ({ startDate, endDate, isoStartDate, isoEndDate, refreshKey }) => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    let cancelToken = null;
    
    try {
      setLoading(true);
      
      // Create a cancellation token for this request
      const cancellation = createCancellationToken();
      cancelToken = cancellation.token;
      
      const data = await fetchSummary(isoStartDate, isoEndDate, { 
        cancelToken 
      });
      
      // Check if the request was canceled
      if (data && data.canceled) return;
      
      setSummaryData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching summary data:', err);
      setError('Failed to fetch dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [isoStartDate, isoEndDate]);

  useEffect(() => {
    // Immediately invoke async function
    fetchDashboardData();
  }, [fetchDashboardData, refreshKey]);

  // Retry handler for error state
  const handleRetry = () => {
    fetchDashboardData();
  };

  // Use memoized components to prevent unnecessary re-renders
  const metricsContent = useMemo(() => (
    <div className="metrics-grid">
      <MetricCard 
        title="Total PRs"
        value={summaryData?.total_prs || 0}
        icon={<TotalPRsIcon />}
      />
      
      <MetricCard 
        title="PRs Merged"
        value={summaryData?.merged_prs || 0}
        icon={<PRsMergedIcon />}
      />
      
      <MetricCard 
        title="Avg PR Size"
        value={summaryData?.avg_pr_size || 0}
        icon={<PRSizeIcon />}
      />
      
      <MetricCard 
        title="Avg Review Time"
        value={summaryData?.avg_review_time || '--'}
        icon={<ReviewTimeIcon />}
      />
      
      <MetricCard 
        title="Avg Cycle Time"
        value={summaryData?.avg_cycle_time || '--'}
        icon={<CycleTimeIcon />}
      />

      <MetricCard 
        title="PRs to Production"
        value={summaryData?.pr_to_prod || '--'}
        icon={<PRsToProductionIcon />}
      />

      <MetricCard 
        title="LoC to Production"
        value={summaryData?.loc_to_prod || '--'}
        icon={<LoCToProductionIcon />}
      />
    </div>
  ), [summaryData]);



  // Prepare repo summary chart data
  const repoSummaryChart = useMemo(() => {
    const chartData = prepareRepoSummaryChartData(summaryData?.repo_summary);
    return (
      <div className="repo-summary-section">
        <h2>Repository Summary</h2>
        <div className="repo-summary-chart">
          <MixedChart 
            data={chartData.data}
            options={chartData.options}
            hasData={chartData.hasData}
            height={300}
          />
        </div>
      </div>
    );
  }, [summaryData?.repo_summary]);

  return (
    <div className="dashboard-overview">
      <StateWrapper
        isLoading={loading}
        isError={error !== null}
        isEmpty={!loading && !error && !summaryData}
        loadingMessage="Loading dashboard metrics..."
        errorMessage={error || 'Failed to load dashboard data'}
        emptyMessage="No metrics data available for the selected date range"
        onRetry={handleRetry}
      >
        <div>
          {metricsContent}
          {repoSummaryChart}
        </div>
      </StateWrapper>
    </div>
  );
};

export default DashboardOverview;
