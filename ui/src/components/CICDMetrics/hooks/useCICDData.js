import { useState, useEffect, useCallback } from 'react';
import { fetchCICDMetrics, createCancellationToken } from '../../../services/api';

/**
 * Custom hook to fetch and manage CICD metrics data
 * 
 * @param {string} isoStartDate - ISO formatted start date
 * @param {string} isoEndDate - ISO formatted end date
 * @param {number} refreshKey - Numeric key that changes to trigger a data refresh
 * @returns {Object} Data and state for CICD metrics
 */
const useCICDData = (isoStartDate, isoEndDate, refreshKey) => {
  const [cicdData, setCicdData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch CICD data with proper cancellation token
  const fetchData = useCallback(async () => {
    let cancelToken = null;
    
    try {
      setLoading(true);
      
      // Create a cancellation token for this request
      const cancellation = createCancellationToken();
      cancelToken = cancellation.token;
      
      const data = await fetchCICDMetrics(isoStartDate, isoEndDate, {
        cancelToken
      });
      
      // Check if the request was canceled
      if (data && data.canceled) return;
      
      setCicdData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching CICD data:', err);
      setError('Failed to fetch CICD data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [isoStartDate, isoEndDate]);

  useEffect(() => {
    // Immediately invoke async function
    fetchData();
  }, [fetchData, refreshKey]);

  return {
    cicdData,
    loading,
    error,
    refreshData: fetchData
  };
};

export default useCICDData;
