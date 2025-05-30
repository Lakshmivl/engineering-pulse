import React from 'react';
import PropTypes from 'prop-types';

/**
 * TableFilters component for filtering pull request data
 * Extracted as a separate component for better organization and reusability
 */
const TableFilters = ({
  showFilters,
  toggleFilters,
  filterState,
  searchFilters,
  onStateFilterChange,
  onSearchFilterChange,
  onResetFilters,
  totalCount,
  filteredCount,
  stateOptions = ['All', 'Open', 'Review In Progress', 'Changes Requested', 'Merged', 'Closed']
}) => {
  // Check if any filters are active
  const hasActiveFilters = filterState !== 'All' || 
    Object.values(searchFilters).some(value => value !== '');

  return (
    <>
      <div className="table-controls">
        <button 
          className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
          onClick={toggleFilters}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
        
        {hasActiveFilters && (
          <button className="reset-filters-btn" onClick={onResetFilters}>
            Reset Filters
          </button>
        )}
        
        {hasActiveFilters && (
          <div className="active-filters-info">
            Showing {filteredCount} of {totalCount} pull requests
          </div>
        )}
      </div>

      {showFilters && (
        <div className="filter-panel">
          <div className="filter-section">
            <label htmlFor="stateFilter">Filter by State:</label>
            <div className="custom-select-container">
              <select 
                id="stateFilter" 
                value={filterState} 
                onChange={(e) => onStateFilterChange(e.target.value)}
                className="filter-select"
              >
                {stateOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <div className="select-arrow"></div>
            </div>
          </div>
          
          <div className="filter-section">
            <label htmlFor="jiraFilter">Jira ID:</label>
            <input
              id="jiraFilter"
              type="text"
              value={searchFilters.Jira_ID}
              onChange={(e) => onSearchFilterChange('Jira_ID', e.target.value)}
              placeholder="Search Jira ID..."
              className="filter-input"
            />
          </div>
          
          <div className="filter-section">
            <label htmlFor="repoFilter">Repository:</label>
            <input
              id="repoFilter"
              type="text"
              value={searchFilters.repository}
              onChange={(e) => onSearchFilterChange('repository', e.target.value)}
              placeholder="Search repository..."
              className="filter-input"
            />
          </div>
          
          <div className="filter-section">
            <label htmlFor="authorFilter">Author:</label>
            <input
              id="authorFilter"
              type="text"
              value={searchFilters.Author}
              onChange={(e) => onSearchFilterChange('Author', e.target.value)}
              placeholder="Search author..."
              className="filter-input"
            />
          </div>
          
          <div className="filter-section">
            <label htmlFor="prNumberFilter">PR Number:</label>
            <input
              id="prNumberFilter"
              type="text"
              value={searchFilters.PRNumber}
              onChange={(e) => onSearchFilterChange('PRNumber', e.target.value)}
              placeholder="Search PR number..."
              className="filter-input"
            />
          </div>
        </div>
      )}
    </>
  );
};

TableFilters.propTypes = {
  showFilters: PropTypes.bool.isRequired,
  toggleFilters: PropTypes.func.isRequired,
  filterState: PropTypes.string.isRequired,
  searchFilters: PropTypes.object.isRequired,
  onStateFilterChange: PropTypes.func.isRequired,
  onSearchFilterChange: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
  totalCount: PropTypes.number.isRequired,
  filteredCount: PropTypes.number.isRequired,
  stateOptions: PropTypes.array
};

export default TableFilters;
