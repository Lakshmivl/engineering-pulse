import React, { useState, useEffect, useCallback, useRef } from 'react';
import { fetchPRTable, createCancellationToken } from '../../services/api';
import { StateWrapper } from '../shared/ui/StateComponents';
import TableFilters from './components/TableFilters';
import TableHeader from './components/TableHeader';
import TableRow from './components/TableRow';
import useTableFilters from './hooks/useTableFilters';
import useTableSort from './hooks/useTableSort';
import './PullRequests.css';

/**
 * PullRequestTable component with enhanced sorting and filtering support.
 * Refactored for better maintainability and performance.
 * 
 * @param {Object} props - Component props
 * @param {string} props.isoStartDate - ISO formatted start date
 * @param {string} props.isoEndDate - ISO formatted end date
 * @param {number} props.refreshKey - Numeric key that changes to trigger a data refresh
 */
const PullRequestTable = ({ isoStartDate, isoEndDate, refreshKey }) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefreshIndicator, setAutoRefreshIndicator] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(null);
  
  // Refs for interval and timeout management
  const autoRefreshIntervalRef = useRef(null);
  const autoRefreshTimeoutRef = useRef(null);

  // Use custom hooks for filtering and sorting
  const {
    filterState,
    searchFilters,
    showFilters,
    filteredData,
    handleStateFilterChange,
    handleSearchFilterChange,
    resetFilters,
    toggleFilters,
    totalCount,
    filteredCount
  } = useTableFilters(tableData);

  const { sortConfig, handleSort, sortedData } = useTableSort(filteredData);

  /**
   * Fetch PR data from API
   * @param {boolean} isAutoRefresh - Whether this is an automatic refresh
   */
  const fetchPRData = useCallback(async (isAutoRefresh = false) => {
    let cancelToken = null;
    
    try {
      // Only show loading spinner if it's not an auto-refresh
      if (!isAutoRefresh) {
        setLoading(true);
      }
      
      // Create a cancellation token for this request
      const cancellation = createCancellationToken();
      cancelToken = cancellation.token;
      
      const data = await fetchPRTable(isoStartDate, isoEndDate, {
        cancelToken
      });
      
      // Check if the request was canceled
      if (data && data.canceled) return;
      
      setTableData(Array.isArray(data) ? data : []);
      setError(null);
      setLastRefreshTime(new Date());
      
      // Show auto-refresh indicator if this was an automatic refresh
      if (isAutoRefresh) {
        // Clear any existing timeout
        if (autoRefreshTimeoutRef.current) {
          clearTimeout(autoRefreshTimeoutRef.current);
        }
        
        setAutoRefreshIndicator(true);
        
        // Set new timeout to hide the indicator
        autoRefreshTimeoutRef.current = setTimeout(() => {
          setAutoRefreshIndicator(false);
          autoRefreshTimeoutRef.current = null;
        }, 3000);
      }
    } catch (err) {
      console.error('Error fetching PR table data:', err);
      setError('Failed to fetch PR data. Please try again later.');
    } finally {
      if (!isAutoRefresh) {
        setLoading(false);
      }
    }
  }, [isoStartDate, isoEndDate]);

  useEffect(() => {
    // Immediately invoke async function
    fetchPRData();
  }, [fetchPRData, refreshKey]);

  // Set up auto-refresh interval for PR table
  useEffect(() => {
    // Clear existing interval if any
    if (autoRefreshIntervalRef.current) {
      clearInterval(autoRefreshIntervalRef.current);
    }

    // Set up new interval for auto-refresh every 10 minutes (600,000 ms)
    autoRefreshIntervalRef.current = setInterval(() => {
      // Only auto-refresh if there's no error and we have data
      if (!error && tableData.length > 0) {
        fetchPRData(true); // Pass true to indicate this is an auto-refresh
      }
    }, 600000); // 10 minutes

    // Cleanup interval and timeout on component unmount or when dependencies change
    return () => {
      if (autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current);
      }
      if (autoRefreshTimeoutRef.current) {
        clearTimeout(autoRefreshTimeoutRef.current);
      }
    };
  }, [fetchPRData, error, tableData.length]);

  // Retry handler for error state
  const handleRetry = () => {
    fetchPRData();
  };

  // Helper function to format time for display
  const formatLastRefreshTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  };

  // Render auto-refresh indicator
  const renderAutoRefreshIndicator = () => {
    // Don't show anything if we don't have a last refresh time yet
    if (!lastRefreshTime) {
      return null;
    }

    return (
      <div className="auto-refresh-status">
        {autoRefreshIndicator && (
          <div className="auto-refresh-notification">
            <span className="refresh-icon">🔄</span>
            PR data refreshed automatically
          </div>
        )}
        <div className="last-refresh-time">
          Last updated: {formatLastRefreshTime(lastRefreshTime)}
          <span className="auto-refresh-info"> (Auto-refreshes every 10 minutes)</span>
        </div>
      </div>
    );
  };

  // Render the table content - extracted for better readability
  const renderTable = () => (
    <div className="table-responsive">
      <table className="pull-request-table">
        <TableHeader 
          sortConfig={sortConfig} 
          onSort={handleSort} 
        />
        <tbody>
          {sortedData.map((pr, index) => (
            <TableRow 
              key={`pr-${pr.PRNumber || ''}-${pr.repository || ''}-${index}`} 
              pr={pr} 
              index={index} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="pull-request-table-container">
      <StateWrapper
        isLoading={loading}
        isError={error !== null}
        isEmpty={!loading && !error && tableData.length === 0}
        loadingMessage="Loading pull request data..."
        errorMessage={error || 'Failed to load pull request data'}
        emptyMessage="No pull request data available for the selected date range"
        onRetry={handleRetry}
      >
        {tableData.length > 0 && (
          <>
            {renderAutoRefreshIndicator()}
            <TableFilters
              showFilters={showFilters}
              toggleFilters={toggleFilters}
              filterState={filterState}
              searchFilters={searchFilters}
              onStateFilterChange={handleStateFilterChange}
              onSearchFilterChange={handleSearchFilterChange}
              onResetFilters={resetFilters}
              totalCount={totalCount}
              filteredCount={filteredCount}
            />
            {renderTable()}
          </>
        )}
      </StateWrapper>
    </div>
  );
};

export default PullRequestTable;
