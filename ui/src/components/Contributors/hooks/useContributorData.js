import { useState, useEffect, useCallback } from 'react';
import { fetchContributors, createCancellationToken } from '../../../services/api';

/**
 * Custom hook to fetch and manage contributor data
 * 
 * @param {string} isoStartDate - ISO formatted start date
 * @param {string} isoEndDate - ISO formatted end date
 * @param {number} refreshKey - Numeric key that changes to trigger a data refresh
 * @returns {Object} Data and state for contributor insights
 */
const useContributorData = (isoStartDate, isoEndDate, refreshKey) => {
  const [contributorData, setContributorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch contributor data with proper cancellation token
  const fetchData = useCallback(async () => {
    let cancelToken = null;
    
    try {
      setLoading(true);
      
      // Create a cancellation token for this request
      const cancellation = createCancellationToken();
      cancelToken = cancellation.token;
      
      const data = await fetchContributors(isoStartDate, isoEndDate, {
        cancelToken
      });
      
      // Check if the request was canceled
      if (data && data.canceled) return;
      
      setContributorData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching contributor data:', err);
      setError('Failed to fetch contributor data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [isoStartDate, isoEndDate]);

  useEffect(() => {
    // Immediately invoke async function
    fetchData();
  }, [fetchData, refreshKey]);

  return {
    contributorData,
    loading,
    error,
    refreshData: fetchData
  };
};

export default useContributorData;
