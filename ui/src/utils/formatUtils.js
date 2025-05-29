/**
 * Formatting utilities for consistent data display across the application
 */

/**
 * Format cycle time from days to hours and minutes
 * @param {number} timeInDays - Time in days
 * @returns {string} - Formatted time string (e.g. "5 h 30 m")
 */
export const formatCycleTime = (timeInDays) => {
  if (timeInDays === undefined || timeInDays === null) return '-- h -- m';
  
  const totalHours = timeInDays * 24;
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);
  
  return `${hours} h ${minutes} m`;
};

/**
 * Format number with thousand separators
 * @param {number} value - Number to format
 * @param {boolean} addPlus - Whether to add a plus sign for positive numbers
 * @returns {string} - Formatted number string
 */
export const formatNumber = (value, addPlus = false) => {
  if (value === undefined || value === null) return '--';
  
  const formatter = new Intl.NumberFormat('en-US');
  const formattedValue = formatter.format(value);
  
  if (addPlus && value > 0) {
    return `+${formattedValue}`;
  }
  
  return formattedValue;
};

/**
 * Format percentage values
 * @param {number} value - Percentage value (e.g. 0.75 for 75%)
 * @param {boolean} addPlus - Whether to add a plus sign for positive values
 * @returns {string} - Formatted percentage string (e.g. "75%")
 */
export const formatPercentage = (value, addPlus = false) => {
  if (value === undefined || value === null) return '--%';
  
  // Convert to percentage if decimal (0.75 -> 75)
  const percentValue = value > 1 ? value : value * 100;
  
  // Round to nearest integer
  const roundedValue = Math.round(percentValue);
  
  // Add plus sign if requested and value is positive
  const prefix = (addPlus && roundedValue > 0) ? '+' : '';
  
  return `${prefix}${roundedValue}%`;
};

/**
 * Format duration in milliseconds to human readable format
 * @param {number} milliseconds - Duration in milliseconds
 * @returns {string} - Formatted duration string (e.g. "2d 5h 30m")
 */
export const formatDuration = (milliseconds) => {
  if (milliseconds === undefined || milliseconds === null) return '--';
  
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  
  let result = '';
  
  if (days > 0) result += `${days}d `;
  if (remainingHours > 0 || days > 0) result += `${remainingHours}h `;
  result += `${remainingMinutes}m`;
  
  return result.trim();
};
