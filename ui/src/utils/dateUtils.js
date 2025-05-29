/**
 * Utility functions for date handling and formatting
 */

/**
 * Formats a date object to ISO string format (YYYY-MM-DD)
 * @param {Date} date - Date object to format
 * @returns {string} - Formatted date string
 */
export const formatDateToISO = (date) => {
  if (!date) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Returns a date range with the current date as end date and
 * 30 days prior as start date (default)
 * @returns {Object} - Object containing start and end dates
 */
export const getDefaultDateRange = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 30); // 30 days before today
  
  return {
    startDate,
    endDate
  };
};

/**
 * Formats a date for display (MM/DD/YYYY)
 * @param {Date} date - Date object to format
 * @returns {string} - Formatted date string for display
 */
export const formatDateForDisplay = (date) => {
  if (!date) return '';
  
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${month}/${day}/${year}`;
};

/**
 * Returns a formatted date range string for display
 * @param {Date} startDate - Start date object
 * @param {Date} endDate - End date object
 * @returns {string} - Formatted date range string (MM/DD/YYYY – MM/DD/YYYY)
 */
export const formatDateRangeForDisplay = (startDate, endDate) => {
  return `${formatDateForDisplay(startDate)} – ${formatDateForDisplay(endDate)}`;
};

/**
 * Parses an ISO date string (from API) to a Date object
 * @param {string} isoString - ISO date string from API (YYYY-MM-DD or with time)
 * @returns {Date} - Date object
 */
export const parseAPIDateString = (isoString) => {
  if (!isoString) return null;
  
  // Handle API date format which might include time
  if (isoString.includes('T')) {
    return new Date(isoString);
  }
  
  // Handle simple YYYY-MM-DD format
  const [year, month, day] = isoString.split('-').map(part => parseInt(part, 10));
  return new Date(year, month - 1, day);
};

/**
 * Formats a timestamp from API (2024-04-01T10:00:00Z) to display format (MM/DD/YYYY)
 * @param {string} timestamp - API timestamp
 * @returns {string} - Formatted date string
 */
export const formatAPITimestampForDisplay = (timestamp) => {
  if (!timestamp) return '-';
  
  const date = new Date(timestamp);
  return formatDateForDisplay(date);
};

/**
 * Parses an ISO date string (YYYY-MM-DD) to a Date object
 * ensuring the exact date is preserved
 * @param {string|Date} dateInput - ISO date string or Date object
 * @returns {Date} - Date object with the exact date
 */
export const parseExactDate = (dateInput) => {
  // If already a Date object, return a clone to avoid modifying the original
  if (dateInput instanceof Date) {
    const clone = new Date(dateInput);
    clone.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
    return clone;
  }
  
  // If it's a string in ISO format (YYYY-MM-DD)
  if (typeof dateInput === 'string' && dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = dateInput.split('-').map(num => parseInt(num, 10));
    return new Date(year, month - 1, day, 12, 0, 0, 0); // Use noon to avoid timezone issues
  }
  
  // If it's another format, try standard parsing but set to noon
  const date = new Date(dateInput);
  date.setHours(12, 0, 0, 0);
  return date;
};

/**
 * Formats a date object or ISO string to compact format (YYYYMMDD)
 * @param {Date|string} dateInput - Date object or ISO date string
 * @returns {string} - Formatted date string in YYYYMMDD format
 */
export const formatDateToCompact = (dateInput) => {
  if (!dateInput) return '';
  
  // Parse the date to ensure exact date preservation
  const date = parseExactDate(dateInput);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}${month}${day}`;
};
