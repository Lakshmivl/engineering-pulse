import {
  formatDateToISO,
  getDefaultDateRange,
  formatDateForDisplay,
  formatDateRangeForDisplay,
  parseAPIDateString,
  formatAPITimestampForDisplay,
  formatDateToCompact
} from './dateUtils';

describe('Date Utilities', () => {
  test('formatDateToISO formats date correctly', () => {
    const testDate = new Date(2024, 3, 15); // April 15, 2024
    expect(formatDateToISO(testDate)).toBe('2024-04-15');
  });

  test('formatDateToISO returns empty string for null date', () => {
    expect(formatDateToISO(null)).toBe('');
  });

  test('getDefaultDateRange returns valid date objects', () => {
    const range = getDefaultDateRange();
    expect(range.startDate instanceof Date).toBe(true);
    expect(range.endDate instanceof Date).toBe(true);
    
    // End date should be today
    const today = new Date();
    expect(range.endDate.getDate()).toBe(today.getDate());
    expect(range.endDate.getMonth()).toBe(today.getMonth());
    expect(range.endDate.getFullYear()).toBe(today.getFullYear());
    
    // Start date should be 30 days before today
    const expectedStartDate = new Date();
    expectedStartDate.setDate(today.getDate() - 30);
    expect(range.startDate.getDate()).toBe(expectedStartDate.getDate());
  });

  test('formatDateForDisplay formats date correctly', () => {
    const testDate = new Date(2024, 3, 15); // April 15, 2024
    expect(formatDateForDisplay(testDate)).toBe('04/15/2024');
  });

  test('formatDateForDisplay returns empty string for null date', () => {
    expect(formatDateForDisplay(null)).toBe('');
  });

  test('formatDateRangeForDisplay formats range correctly', () => {
    const startDate = new Date(2024, 3, 1); // April 1, 2024
    const endDate = new Date(2024, 3, 30); // April 30, 2024
    
    expect(formatDateRangeForDisplay(startDate, endDate)).toBe('04/01/2024 – 04/30/2024');
  });

  test('parseAPIDateString handles ISO date strings', () => {
    const dateString = '2024-04-15';
    const parsed = parseAPIDateString(dateString);
    
    expect(parsed.getFullYear()).toBe(2024);
    expect(parsed.getMonth()).toBe(3); // 0-based, so 3 = April
    expect(parsed.getDate()).toBe(15);
  });

  test('parseAPIDateString handles ISO datetime strings', () => {
    const dateTimeString = '2024-04-15T10:30:00Z';
    const parsed = parseAPIDateString(dateTimeString);
    
    expect(parsed.getFullYear()).toBe(2024);
    expect(parsed.getMonth()).toBe(3); // 0-based, so 3 = April
    expect(parsed.getDate()).toBe(15);
  });

  test('parseAPIDateString returns null for empty input', () => {
    expect(parseAPIDateString(null)).toBe(null);
    expect(parseAPIDateString('')).toBe(null);
  });

  test('formatAPITimestampForDisplay formats API timestamp for display', () => {
    const timestamp = '2024-04-15T10:30:00Z';
    expect(formatAPITimestampForDisplay(timestamp)).toBe('04/15/2024');
  });

  test('formatAPITimestampForDisplay returns dash for empty input', () => {
    expect(formatAPITimestampForDisplay(null)).toBe('-');
    expect(formatAPITimestampForDisplay('')).toBe('-');
  });

  test('formatDateToCompact formats date correctly to YYYYMMDD', () => {
    const testDate = new Date(2024, 3, 15); // April 15, 2024
    expect(formatDateToCompact(testDate)).toBe('20240415');
  });

  test('formatDateToCompact returns empty string for null date', () => {
    expect(formatDateToCompact(null)).toBe('');
  });
});
