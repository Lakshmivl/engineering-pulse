import { useState, useEffect, useCallback } from 'react';
import { apiConfig } from '../../../config/api.config';
import { envConfig } from '../../../config/env.config';
import { mockConfig } from '../../../config/mock.config';

/**
 * Custom hook for fetching QE metrics data
 * @param {string} isoStartDate - ISO formatted start date
 * @param {string} isoEndDate - ISO formatted end date
 * @param {string} selectedRepository - Selected repository filter
 * @param {number} refreshKey - Key that triggers data refresh when changed
 * @returns {Object} Hook state and methods
 */
const useQEData = (isoStartDate, isoEndDate, selectedRepository, refreshKey) => {
  const [qeData, setQeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch QE metrics data from API or return mock data
   */
  const fetchQEData = useCallback(async () => {
    if (!isoStartDate || !isoEndDate) {
      setError('Start date and end date are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check if mock responses are enabled
      if (envConfig.CURRENT_ENV.mockResponses) {
        console.log('Using mock QE data');
        // Simulate API delay
        const data = await mockConfig.getWithDelay(mockConfig.MOCK_QE, 500);
        console.log('Mock QE data received:', data);
        setQeData(data);
        return;
      }

      const url = new URL(apiConfig.BASE_URL + apiConfig.ENDPOINTS.QE_METRICS);
      
      // Convert ISO dates to YYYYMMDD format
      const formatDateForAPI = (isoDate) => {
        // Handle ISO date string more reliably to avoid timezone issues
        let date;
        if (typeof isoDate === 'string' && isoDate.includes('T')) {
          // If it's a full ISO string with time, parse it directly
          date = new Date(isoDate);
        } else if (typeof isoDate === 'string' && isoDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
          // If it's a date-only string (YYYY-MM-DD), append time to avoid timezone issues
          date = new Date(isoDate + 'T00:00:00.000Z');
        } else {
          // Fallback to direct parsing
          date = new Date(isoDate);
        }
        
        // Use UTC methods to avoid timezone conversion issues
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        return `${year}${month}${day}`;
      };

      const startDate = formatDateForAPI(isoStartDate);
      const endDate = formatDateForAPI(isoEndDate);
      
      // Add query parameters
      url.searchParams.append('request_type', apiConfig.REQUEST_TYPES.QE_METRICS);
      url.searchParams.append('startDate', startDate);
      url.searchParams.append('endDate', endDate);
      
      // Only add repo parameter if repository is selected
      if (selectedRepository) {
        url.searchParams.append('repo', selectedRepository);
      }

      console.log('Fetching QE data from:', url.toString());

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('QE data received:', data);

      setQeData(data);
    } catch (err) {
      console.error('Error fetching QE data:', err);
      setError(err.message || 'Failed to fetch QE metrics data');
    } finally {
      setLoading(false);
    }
  }, [isoStartDate, isoEndDate, selectedRepository]);

  /**
   * Refresh data manually
   */
  const refreshData = useCallback(() => {
    fetchQEData();
  }, [fetchQEData]);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchQEData();
  }, [fetchQEData, refreshKey]);

  return {
    qeData,
    loading,
    error,
    refreshData
  };
};

export default useQEData;
