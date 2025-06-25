import { useState, useEffect, useCallback } from 'react';
import { apiConfig } from '../../../config/api.config';

/**
 * Custom hook for fetching QE metrics data
 * @param {string} isoStartDate - ISO formatted start date
 * @param {string} isoEndDate - ISO formatted end date
 * @param {number} refreshKey - Key that triggers data refresh when changed
 * @returns {Object} Hook state and methods
 */
const useQEData = (isoStartDate, isoEndDate, refreshKey) => {
  const [qeData, setQeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch QE metrics data from API
   */
  const fetchQEData = useCallback(async () => {
    if (!isoStartDate || !isoEndDate) {
      setError('Start date and end date are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = new URL(apiConfig.BASE_URL + apiConfig.ENDPOINTS.QE_METRICS);
      
      // Convert ISO dates to YYYYMMDD format
      const formatDateForAPI = (isoDate) => {
        const date = new Date(isoDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
      };

      const startDate = formatDateForAPI(isoStartDate);
      const endDate = formatDateForAPI(isoEndDate);
      
      // Add query parameters
      url.searchParams.append('request_type', apiConfig.REQUEST_TYPES.QE_METRICS);
      url.searchParams.append('startDate', startDate);
      url.searchParams.append('endDate', endDate);

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
  }, [isoStartDate, isoEndDate]);

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
