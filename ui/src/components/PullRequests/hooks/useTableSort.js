import { useState, useMemo } from 'react';

/**
 * Custom hook for managing table sorting
 * Encapsulates sorting state and logic in a reusable way
 * 
 * @param {Array} data - The data array to sort
 * @param {string} defaultSortKey - Default column key to sort by
 * @param {string} defaultDirection - Default sort direction ('asc' or 'desc')
 * @returns {Object} - Sorting state and handlers
 */
const useTableSort = (data, defaultSortKey = 'CreatedDate', defaultDirection = 'desc') => {
  const [sortConfig, setSortConfig] = useState({ 
    key: defaultSortKey, 
    direction: defaultDirection 
  });

  /**
   * Handle sort column click
   * @param {string} key - Column key to sort by
   */
  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  /**
   * Get sorted data based on current sort configuration
   */
  const sortedData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      // Handle null or undefined values
      const valA = a[sortConfig.key] ?? '';
      const valB = b[sortConfig.key] ?? '';
      
      // Handle different data types
      if (typeof valA === 'string') {
        return sortConfig.direction === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else if (typeof valA === 'number') {
        return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
      } else if (valA instanceof Date && valB instanceof Date) {
        return sortConfig.direction === 'asc'
          ? valA.getTime() - valB.getTime()
          : valB.getTime() - valA.getTime();
      }
      
      // Fallback for other types
      return sortConfig.direction === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [data, sortConfig]);

  return {
    sortConfig,
    handleSort,
    sortedData
  };
};

export default useTableSort;
