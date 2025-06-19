import axios from 'axios';
import { formatDateToCompact } from '../utils/dateUtils';
import { apiConfig, envConfig, mockConfig } from '../config';

// Import necessary configs
const { BASE_URL, ENDPOINTS, REQUEST_TYPES } = apiConfig;
const { CURRENT_ENV } = envConfig;
const { MOCK_SUMMARY, MOCK_PR_TABLE, MOCK_CONTRIBUTORS, MOCK_CICD, getWithDelay } = mockConfig || {};

/**
 * Create a configured axios instance for making API requests
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: CURRENT_ENV.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for logging, adding auth tokens, etc.
apiClient.interceptors.request.use(
  (config) => {
    // Could add authentication headers here if needed
    return config;
  },
  (error) => {
    console.error('API request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let errorMessage = 'An unknown error occurred';
    if (error.response) {
      // The request was made and the server responded with an error status
      errorMessage = `Server error: ${error.response.status}`;
      console.error('API response error:', error.response);
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response received from server';
      console.error('API no response error:', error.request);
    } else {
      // Something happened in setting up the request that triggered an error
      errorMessage = error.message;
      console.error('API setup error:', error.message);
    }
    
    return Promise.reject({
      originalError: error,
      message: errorMessage
    });
  }
);

/**
 * Create a cancellation token for API requests
 * @returns {object} Object containing cancel token and cancel function
 */
export const createCancellationToken = () => {
  const source = axios.CancelToken.source();
  return {
    token: source.token,
    cancel: source.cancel
  };
};

/**
 * Fetches PR metrics table data
 * @param {string} startDate - Start date in ISO format
 * @param {string} endDate - End date in ISO format
 * @param {object} options - Additional options
 * @param {object} [options.cancelToken] - Cancellation token for the request
 * @returns {Promise} - Promise resolving to PR table data
 */
export const fetchPRTable = async (startDate, endDate, options = {}) => {
  try {
    // Return mock data if mock responses are enabled
    if (CURRENT_ENV.mockResponses) {
      console.log('Using mock data for PR table');
      return await getWithDelay(MOCK_PR_TABLE);
    }
    
    // Convert dates to compact format YYYYMMDD
    const compactStartDate = formatDateToCompact(startDate);
    const compactEndDate = formatDateToCompact(endDate);
    
    const response = await apiClient.get(ENDPOINTS.PR_TABLE, {
      params: {
        startDate: compactStartDate,
        endDate: compactEndDate,
        reqType: REQUEST_TYPES.PR_DETAILS
      },
      cancelToken: options.cancelToken
    });
    
    return response.data;
  } catch (error) {
    // Handle axios cancellation separately - don't treat as an error
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
      return { canceled: true };
    }
    
    console.error('Error fetching PR table data:', error);
    throw error;
  }
};

/**
 * Fetches contributor insights data
 * @param {string} startDate - Start date in ISO format
 * @param {string} endDate - End date in ISO format
 * @param {object} options - Additional options
 * @param {object} [options.cancelToken] - Cancellation token for the request
 * @returns {Promise} - Promise resolving to contributor data
 */
export const fetchContributors = async (startDate, endDate, options = {}) => {
  try {
    // Return mock data if mock responses are enabled
    if (CURRENT_ENV.mockResponses) {
      console.log('Using mock data for contributors');
      return await getWithDelay(MOCK_CONTRIBUTORS);
    }
    
    // Convert dates to compact format YYYYMMDD
    const compactStartDate = formatDateToCompact(startDate);
    const compactEndDate = formatDateToCompact(endDate);
    
    const response = await apiClient.get(ENDPOINTS.CONTRIBUTORS, {
      params: {
        startDate: compactStartDate,
        endDate: compactEndDate,
        reqType: REQUEST_TYPES.CONTRIBUTORS
      },
      cancelToken: options.cancelToken
    });
    
    return response.data;
  } catch (error) {
    // Handle axios cancellation separately - don't treat as an error
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
      return { canceled: true };
    }
    
    console.error('Error fetching contributor data:', error);
    throw error;
  }
};

/**
 * Fetches summary metrics data
 * @param {string} startDate - Start date in ISO format
 * @param {string} endDate - End date in ISO format
 * @param {object} options - Additional options
 * @param {object} [options.cancelToken] - Cancellation token for the request
 * @returns {Promise} - Promise resolving to summary data
 */
export const fetchSummary = async (startDate, endDate, options = {}) => {
  try {
    // Return mock data if mock responses are enabled
    if (CURRENT_ENV.mockResponses) {
      console.log('Using mock data for summary');
      return await getWithDelay(MOCK_SUMMARY);
    }
    
    // Convert dates to compact format YYYYMMDD
    const compactStartDate = formatDateToCompact(startDate);
    const compactEndDate = formatDateToCompact(endDate);
    
    const response = await apiClient.get(ENDPOINTS.SUMMARY, {
      params: {
        startDate: compactStartDate,
        endDate: compactEndDate,
        reqType: REQUEST_TYPES.SUMMARY
      },
      cancelToken: options.cancelToken
    });
    
    return response.data;
  } catch (error) {
    // Handle axios cancellation separately - don't treat as an error
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
      return { canceled: true };
    }
    
    console.error('Error fetching summary data:', error);
    throw error;
  }
};

/**
 * Fetches CI/CD metrics data
 * @param {string} startDate - Start date in ISO format
 * @param {string} endDate - End date in ISO format
 * @param {object} options - Additional options
 * @param {object} [options.cancelToken] - Cancellation token for the request
 * @returns {Promise} - Promise resolving to CICD metrics data
 */
export const fetchCICDMetrics = async (startDate, endDate, options = {}) => {
  try {
    // Return mock data if mock responses are enabled
    if (CURRENT_ENV.mockResponses) {
      console.log('Using mock data for CICD metrics');
      return await getWithDelay(MOCK_CICD);
    }
    
    // Convert dates to compact format YYYYMMDD
    const compactStartDate = formatDateToCompact(startDate);
    const compactEndDate = formatDateToCompact(endDate);
    
    const response = await apiClient.get(ENDPOINTS.CICD, {
      params: {
        startDate: compactStartDate,
        endDate: compactEndDate,
        reqType: REQUEST_TYPES.CICD_METRICS
      },
      cancelToken: options.cancelToken
    });
    
    return response.data;
  } catch (error) {
    // Handle axios cancellation separately - don't treat as an error
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
      return { canceled: true };
    }
    
    console.error('Error fetching CICD metrics data:', error);
    throw error;
  }
};

/**
 * Common API response handler with standardized error formatting
 * @param {Promise} apiPromise - Promise returned from an API call
 * @param {string} errorMessage - Custom error message for this API call
 * @returns {Promise} - Formatted response or error object
 */
export const handleApiResponse = async (apiPromise, errorMessage) => {
  try {
    const response = await apiPromise;
    return { 
      success: true, 
      data: response,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: {
        message: errorMessage,
        details: error.message || 'Unknown error',
        originalError: error
      }
    };
  }
};
