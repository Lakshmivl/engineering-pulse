import { useState, useEffect, useMemo, useCallback } from 'react';

/**
 * Custom hook for managing table filters
 * Encapsulates filter state and logic in a reusable way
 * 
 * @param {Array} data - The original data array to filter
 * @returns {Object} - Filter state and handlers
 */
const useTableFilters = (data) => {
  const [filterState, setFilterState] = useState('All');
  const [searchFilters, setSearchFilters] = useState({
    Jira_ID: '',
    repository: '',
    Author: '',
    PRNumber: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  // Apply filters to data
  const applyFilters = useCallback((state, searches) => {
    if (!data || !Array.isArray(data)) {
      setFilteredData([]);
      return;
    }

    let filtered = [...data];
    
    // Apply state filter
    if (state !== 'All') {
      filtered = filtered.filter(pr => pr.State === state);
    }
    
    // Apply search filters
    Object.entries(searches).forEach(([field, value]) => {
      if (value) {
        const searchValue = value.toLowerCase();
        filtered = filtered.filter(pr => {
          const fieldValue = String(pr[field] || '').toLowerCase();
          return fieldValue.includes(searchValue);
        });
      }
    });
    
    setFilteredData(filtered);
  }, [data]);

  // Filter logic
  useEffect(() => {
    applyFilters(filterState, searchFilters);
  }, [data, filterState, searchFilters, applyFilters]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return filterState !== 'All' || 
      Object.values(searchFilters).some(value => value !== '');
  }, [filterState, searchFilters]);

  // Handle state filter change
  const handleStateFilterChange = (state) => {
    setFilterState(state);
  };

  // Handle search filter change
  const handleSearchFilterChange = (field, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilterState('All');
    setSearchFilters({
      Jira_ID: '',
      repository: '',
      Author: '',
      PRNumber: ''
    });
  };

  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };
  
  return {
    filterState,
    searchFilters,
    showFilters,
    filteredData,
    hasActiveFilters,
    handleStateFilterChange,
    handleSearchFilterChange,
    resetFilters,
    toggleFilters,
    totalCount: data?.length || 0,
    filteredCount: filteredData?.length || 0
  };
};

export default useTableFilters;
