// Set up mock modules before importing any other modules
const mockAxiosGet = jest.fn();
const mockAxiosInstance = {
  get: mockAxiosGet,
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() }
  }
};

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => mockAxiosInstance),
  isCancel: jest.fn(err => err && err.__CANCEL__),
  CancelToken: {
    source: jest.fn().mockReturnValue({
      token: 'mock-token',
      cancel: jest.fn()
    })
  }
}));

// Mock dateUtils
jest.mock('../utils/dateUtils', () => ({
  formatDateToCompact: jest.fn()
}));

// Mock config
jest.mock('../config', () => ({
  apiConfig: {
    BASE_URL: 'https://test-api.example.com',
    ENDPOINTS: {
      PR_TABLE: '/api/pr-metrics/table',
      CONTRIBUTORS: '/api/pr-metrics/contributors',
      SUMMARY: '/api/pr-metrics/summary'
    },
    REQUEST_TYPES: {
      PR_DETAILS: 'prdetails',
      CONTRIBUTORS: 'contributors',
      SUMMARY: 'summary'
    }
  },
  envConfig: {
    CURRENT_ENV: {
      apiTimeout: 30000,
      mockResponses: false
    }
  },
  mockConfig: {
    MOCK_SUMMARY: {},
    MOCK_PR_TABLE: [],
    MOCK_CONTRIBUTORS: {},
    getWithDelay: jest.fn()
  }
}));

// Now import the modules
const axios = require('axios');
const { formatDateToCompact } = require('../utils/dateUtils');
const { apiConfig, envConfig } = require('../config');

// Get the API methods after mocks are set up
const { 
  fetchPRTable, 
  fetchContributors, 
  fetchSummary, 
  createCancellationToken,
  handleApiResponse 
} = require('./api');

// Test data
const mockStartDate = '2023-01-01';
const mockEndDate = '2023-01-31';
const mockCompactStartDate = '20230101';
const mockCompactEndDate = '20230131';

describe('API Service', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Spy on console.error
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Set up the formatDateToCompact mock
    formatDateToCompact.mockImplementation(date => {
      if (date === mockStartDate) return mockCompactStartDate;
      if (date === mockEndDate) return mockCompactEndDate;
      return 'unknown-date';
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('fetchPRTable', () => {
    it('should fetch PR table data successfully', async () => {
      // Setup
      const mockResponseData = [{ id: 1, title: 'Test PR' }];
      mockAxiosGet.mockResolvedValueOnce({ data: mockResponseData });

      // Execute
      const result = await fetchPRTable(mockStartDate, mockEndDate);

      // Verify
      expect(formatDateToCompact).toHaveBeenCalledWith(mockStartDate);
      expect(formatDateToCompact).toHaveBeenCalledWith(mockEndDate);
      expect(mockAxiosGet).toHaveBeenCalledWith(
        apiConfig.ENDPOINTS.PR_TABLE,
        expect.objectContaining({
          params: {
            startDate: mockCompactStartDate,
            endDate: mockCompactEndDate,
            reqType: apiConfig.REQUEST_TYPES.PR_DETAILS
          }
        })
      );
      expect(result).toEqual(mockResponseData);
    });

    it('should handle errors when fetching PR table data', async () => {
      // Setup
      const mockError = new Error('Network error');
      mockAxiosGet.mockRejectedValueOnce(mockError);

      // Execute & Verify
      await expect(fetchPRTable(mockStartDate, mockEndDate)).rejects.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should handle canceled requests gracefully', async () => {
      // Setup
      const mockCancelError = new Error('Operation canceled');
      mockCancelError.__CANCEL__ = true; // This is how axios marks canceled requests
      mockAxiosGet.mockRejectedValueOnce(mockCancelError);
      
      // Execute
      const result = await fetchPRTable(mockStartDate, mockEndDate);
      
      // Verify
      expect(result).toEqual({ canceled: true });
    });
  });

  describe('fetchContributors', () => {
    it('should fetch contributor data successfully', async () => {
      // Setup
      const mockResponseData = [{ name: 'Contributor 1', contributions: 10 }];
      mockAxiosGet.mockResolvedValueOnce({ data: mockResponseData });

      // Execute
      const result = await fetchContributors(mockStartDate, mockEndDate);

      // Verify
      expect(formatDateToCompact).toHaveBeenCalledWith(mockStartDate);
      expect(formatDateToCompact).toHaveBeenCalledWith(mockEndDate);
      expect(mockAxiosGet).toHaveBeenCalledWith(
        apiConfig.ENDPOINTS.CONTRIBUTORS,
        expect.objectContaining({
          params: {
            startDate: mockCompactStartDate,
            endDate: mockCompactEndDate,
            reqType: apiConfig.REQUEST_TYPES.CONTRIBUTORS
          }
        })
      );
      expect(result).toEqual(mockResponseData);
    });

    it('should handle errors when fetching contributor data', async () => {
      // Setup
      const mockError = new Error('Network error');
      mockAxiosGet.mockRejectedValueOnce(mockError);

      // Execute & Verify
      await expect(fetchContributors(mockStartDate, mockEndDate)).rejects.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('fetchSummary', () => {
    it('should fetch summary data successfully', async () => {
      // Setup
      const mockResponseData = { total_prs: 50, merged_prs: 45 };
      mockAxiosGet.mockResolvedValueOnce({ data: mockResponseData });

      // Execute
      const result = await fetchSummary(mockStartDate, mockEndDate);

      // Verify
      expect(formatDateToCompact).toHaveBeenCalledWith(mockStartDate);
      expect(formatDateToCompact).toHaveBeenCalledWith(mockEndDate);
      expect(mockAxiosGet).toHaveBeenCalledWith(
        apiConfig.ENDPOINTS.SUMMARY,
        expect.objectContaining({
          params: {
            startDate: mockCompactStartDate,
            endDate: mockCompactEndDate,
            reqType: apiConfig.REQUEST_TYPES.SUMMARY
          }
        })
      );
      expect(result).toEqual(mockResponseData);
    });

    it('should handle errors when fetching summary data', async () => {
      // Setup
      const mockError = new Error('Network error');
      mockAxiosGet.mockRejectedValueOnce(mockError);

      // Execute & Verify
      await expect(fetchSummary(mockStartDate, mockEndDate)).rejects.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('createCancellationToken', () => {
    it('should create a token source with cancel method', () => {
      // Setup
      const mockCancelTokenSource = {
        token: 'mock-token',
        cancel: jest.fn()
      };
      axios.CancelToken.source.mockReturnValueOnce(mockCancelTokenSource);
      
      // Execute
      const result = createCancellationToken();
      
      // Verify
      expect(result).toHaveProperty('token', 'mock-token');
      expect(result).toHaveProperty('cancel');
      expect(typeof result.cancel).toBe('function');
    });
  });

  describe('handleApiResponse', () => {
    it('should return successful response in standard format', async () => {
      // Setup
      const mockPromise = Promise.resolve('success data');
      
      // Execute
      const result = await handleApiResponse(mockPromise, 'Error message');
      
      // Verify
      expect(result).toEqual({
        success: true,
        data: 'success data',
        error: null
      });
    });
    
    it('should return error in standard format when promise rejects', async () => {
      // Setup
      const mockError = new Error('Test error');
      const mockPromise = Promise.reject(mockError);
      
      // Execute
      const result = await handleApiResponse(mockPromise, 'Custom error message');
      
      // Verify
      expect(result).toEqual({
        success: false,
        data: null,
        error: {
          message: 'Custom error message',
          details: 'Test error',
          originalError: mockError
        }
      });
    });
  });
});
