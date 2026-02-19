import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import useCICDData from './useCICDData';
import { fetchCICDMetrics, createCancellationToken } from '../../../services/api';
import { MOCK_CICD_DATA } from '../__mocks__/mockCICDData';

// Mock the API functions
jest.mock('../../../services/api', () => ({
  fetchCICDMetrics: jest.fn(),
  createCancellationToken: jest.fn(),
}));

describe('useCICDData Hook', () => {
  const mockCancelToken = { token: 'mock-token', cancel: jest.fn() };
  
  beforeEach(() => {
    jest.clearAllMocks();
    createCancellationToken.mockReturnValue(mockCancelToken);
    fetchCICDMetrics.mockResolvedValue(MOCK_CICD_DATA);
  });

  test('fetches data successfully on mount', async () => {
    const { result } = renderHook(() => 
      useCICDData('2024-04-01', '2024-04-30', 1)
    );

    // Initially should be loading
    expect(result.current.loading).toBe(true);
    expect(result.current.cicdData).toBe(null);
    expect(result.current.error).toBe(null);

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.cicdData).toEqual(MOCK_CICD_DATA);
    expect(result.current.error).toBe(null);
    expect(fetchCICDMetrics).toHaveBeenCalledWith(
      '2024-04-01',
      '2024-04-30',
      { cancelToken: mockCancelToken.token }
    );
  });

  test('handles API errors gracefully', async () => {
    const errorMessage = 'Network error';
    fetchCICDMetrics.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => 
      useCICDData('2024-04-01', '2024-04-30', 1)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.cicdData).toBe(null);
    expect(result.current.error).toBe('Failed to fetch CICD data. Please try again later.');
  });

  test('handles canceled requests', async () => {
    fetchCICDMetrics.mockResolvedValue({ canceled: true });

    const { result } = renderHook(() => 
      useCICDData('2024-04-01', '2024-04-30', 1)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // When request is canceled, data should remain null but no error should be set
    expect(result.current.cicdData).toBe(null);
    expect(result.current.error).toBe(null);
  });

  test('refetches data when dates change', async () => {
    const { result, rerender } = renderHook(
      ({ startDate, endDate, refreshKey }) => useCICDData(startDate, endDate, refreshKey),
      {
        initialProps: {
          startDate: '2024-04-01',
          endDate: '2024-04-30',
          refreshKey: 1
        }
      }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchCICDMetrics).toHaveBeenCalledTimes(1);

    // Change dates
    rerender({
      startDate: '2024-05-01',
      endDate: '2024-05-31',
      refreshKey: 1
    });

    await waitFor(() => {
      expect(fetchCICDMetrics).toHaveBeenCalledTimes(2);
    });

    expect(fetchCICDMetrics).toHaveBeenLastCalledWith(
      '2024-05-01',
      '2024-05-31',
      { cancelToken: mockCancelToken.token }
    );
  });

  test('refetches data when refreshKey changes', async () => {
    const { result, rerender } = renderHook(
      ({ startDate, endDate, refreshKey }) => useCICDData(startDate, endDate, refreshKey),
      {
        initialProps: {
          startDate: '2024-04-01',
          endDate: '2024-04-30',
          refreshKey: 1
        }
      }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchCICDMetrics).toHaveBeenCalledTimes(1);

    // Change refresh key
    rerender({
      startDate: '2024-04-01',
      endDate: '2024-04-30',
      refreshKey: 2
    });

    await waitFor(() => {
      expect(fetchCICDMetrics).toHaveBeenCalledTimes(2);
    });
  });

  test('provides refreshData function that refetches data', async () => {
    const { result } = renderHook(() => 
      useCICDData('2024-04-01', '2024-04-30', 1)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchCICDMetrics).toHaveBeenCalledTimes(1);

    // Call refreshData
    act(() => {
      result.current.refreshData();
    });

    await waitFor(() => {
      expect(fetchCICDMetrics).toHaveBeenCalledTimes(2);
    });
  });

  test('creates cancellation token for each request', async () => {
    renderHook(() => useCICDData('2024-04-01', '2024-04-30', 1));

    await waitFor(() => {
      expect(createCancellationToken).toHaveBeenCalledTimes(1);
    });

    expect(fetchCICDMetrics).toHaveBeenCalledWith(
      '2024-04-01',
      '2024-04-30',
      { cancelToken: mockCancelToken.token }
    );
  });

  test('manages loading state correctly during fetch', async () => {
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    fetchCICDMetrics.mockReturnValue(promise);

    const { result } = renderHook(() => 
      useCICDData('2024-04-01', '2024-04-30', 1)
    );

    // Should be loading initially
    expect(result.current.loading).toBe(true);

    // Resolve the promise
    act(() => {
      resolvePromise(MOCK_CICD_DATA);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.cicdData).toEqual(MOCK_CICD_DATA);
  });

  test('clears error when successful fetch occurs after error', async () => {
    // First call fails
    fetchCICDMetrics.mockRejectedValueOnce(new Error('Network error'));

    const { result, rerender } = renderHook(
      ({ refreshKey }) => useCICDData('2024-04-01', '2024-04-30', refreshKey),
      { initialProps: { refreshKey: 1 } }
    );

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    // Second call succeeds
    fetchCICDMetrics.mockResolvedValue(MOCK_CICD_DATA);
    
    rerender({ refreshKey: 2 });

    await waitFor(() => {
      expect(result.current.error).toBe(null);
    });

    expect(result.current.cicdData).toEqual(MOCK_CICD_DATA);
  });

  test('handles multiple rapid date changes correctly', async () => {
    const { rerender } = renderHook(
      ({ startDate, endDate }) => useCICDData(startDate, endDate, 1),
      {
        initialProps: {
          startDate: '2024-04-01',
          endDate: '2024-04-30'
        }
      }
    );

    // Rapidly change dates multiple times
    rerender({ startDate: '2024-05-01', endDate: '2024-05-31' });
    rerender({ startDate: '2024-06-01', endDate: '2024-06-30' });
    rerender({ startDate: '2024-07-01', endDate: '2024-07-31' });

    await waitFor(() => {
      expect(fetchCICDMetrics).toHaveBeenCalledTimes(4); // Initial + 3 changes
    });

    // Should have been called with the latest dates
    expect(fetchCICDMetrics).toHaveBeenLastCalledWith(
      '2024-07-01',
      '2024-07-31',
      { cancelToken: mockCancelToken.token }
    );
  });

  test('console logs error when fetch fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Network error');
    fetchCICDMetrics.mockRejectedValue(error);

    renderHook(() => useCICDData('2024-04-01', '2024-04-30', 1));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching CICD data:', error);
    });

    consoleSpy.mockRestore();
  });
});
