import React, { useState, useEffect, useCallback } from 'react';
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
   */
  const fetchPRData = useCallback(async () => {
    let cancelToken = null;
    
    try {
      setLoading(true);
      
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
    } catch (err) {
      console.error('Error fetching PR table data:', err);
      setError('Failed to fetch PR data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [isoStartDate, isoEndDate]);

  useEffect(() => {
    // Immediately invoke async function
    fetchPRData();
  }, [fetchPRData, refreshKey]);

  // Retry handler for error state
  const handleRetry = () => {
    fetchPRData();
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
