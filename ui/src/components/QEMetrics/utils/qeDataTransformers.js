/**
 * Data transformation utilities for QE Metrics
 * Transforms API data into formats suitable for different chart types
 */

/**
 * Transform QE data for metric cards
 * @param {Object} qeData - Complete QE API response
 * @returns {Object} Formatted data for metric cards
 */
export const transformForQEMetricCards = (qeData) => {
  if (!qeData) return null;

  return {
    highestFailures: {
      title: 'Repository with Highest Test Failure Rate',
      value: `${qeData.repo_with_highest_automation_failures?.repo?.toUpperCase() || 'N/A'} (${qeData.repo_with_highest_automation_failures?.failure_percentage || 0}%)`,
      subtitle: `${qeData.repo_with_highest_automation_failures?.failure_count || 0} total failures`,
      trend: 'negative'
    },
    longestAutomation: {
      title: 'Repository with Longest Average Test Duration',
      value: `${qeData.repo_with_longest_automation?.repo?.toUpperCase() || 'N/A'} (${Math.round(qeData.repo_with_longest_automation?.avg_automation_duration_mins || 0)}m)`,
      subtitle: 'Average automation duration',
      trend: 'neutral'
    }
  };
};

/**
 * Transform QE data for automation duration bar chart
 * @param {Array} durationData - Automation duration by repo data
 * @returns {Object} Formatted data for horizontal bar chart
 */
export const transformForAutomationDurationChart = (durationData) => {
  if (!durationData || !Array.isArray(durationData)) return null;

  const labels = durationData.map(item => item.repo.toUpperCase());
  const data = durationData.map(item => Math.round(item.avg_automation_duration_mins));

  return {
    labels,
    datasets: [{
      label: 'Avg Duration (mins)',
      data,
      backgroundColor: '#3B82F6',
      borderColor: '#2563EB',
      borderWidth: 1
    }]
  };
};

/**
 * Transform QE data for failures bar chart
 * @param {Array} failuresData - Failures by repo data
 * @returns {Object} Formatted data for horizontal bar chart
 */
export const transformForFailuresChart = (failuresData) => {
  if (!failuresData || !Array.isArray(failuresData)) return null;

  const labels = failuresData.map(item => item.repo.toUpperCase());
  const data = failuresData.map(item => item.failure_percentage);

  return {
    labels,
    datasets: [{
      label: 'Failure Percentage (%)',
      data,
      backgroundColor: '#EF4444',
      borderColor: '#DC2626',
      borderWidth: 1
    }]
  };
};

/**
 * Transform QE data for heatmap visualization
 * @param {Array} heatmapData - PR delivery heatmap data
 * @param {string} startDate - ISO start date
 * @param {string} endDate - ISO end date
 * @returns {Object} Formatted data for heatmap
 */
export const transformForHeatmap = (heatmapData, startDate, endDate) => {
  if (!heatmapData || !Array.isArray(heatmapData) || !startDate || !endDate) return null;

  // Filter data by date range
  const filteredData = heatmapData.filter(item => {
    const mergeDate = new Date(item.merged_date);
    return mergeDate >= new Date(startDate) && mergeDate <= new Date(endDate);
  });

  if (filteredData.length === 0) {
    return {
      labels: { x: [], y: [] },
      data: []
    };
  }

  // Create date range array
  const dateRange = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dateRange.push(new Date(d).toISOString().split('T')[0]);
  }

  // Get unique repositories from filtered data
  const repos = [...new Set(filteredData.map(item => item.repo))].sort();

  // Create matrix data
  const matrixData = [];
  repos.forEach((repo, repoIndex) => {
    dateRange.forEach((date, dateIndex) => {
      const dayData = filteredData.filter(item => 
        item.repo === repo && 
        item.merged_date.split('T')[0] === date
      );
      
      matrixData.push({
        x: dateIndex,
        y: repoIndex,
        v: dayData.length, // count of PRs
        repo: repo,
        date: date,
        prs: dayData,
        jiraTickets: dayData.filter(pr => pr.jira_id && pr.jira_url).map(pr => ({
          id: pr.jira_id,
          url: pr.jira_url
        }))
      });
    });
  });

  return {
    labels: {
      x: dateRange,
      y: repos
    },
    data: matrixData
  };
};

/**
 * Format time values for display
 * @param {number} minutes - Time in minutes
 * @returns {string} Formatted time string
 */
export const formatTime = (minutes) => {
  if (!minutes || minutes < 1) return '< 1m';
  if (minutes < 60) return `${Math.round(minutes)}m`;
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
};

/**
 * Calculate percentage with proper rounding
 * @param {number} value - Numerator
 * @param {number} total - Denominator
 * @returns {number} Percentage rounded to 1 decimal place
 */
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 1000) / 10; // Round to 1 decimal place
};

/**
 * Get trend direction based on value comparison
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {string} Trend direction ('up', 'down', 'stable')
 */
export const getTrendDirection = (current, previous) => {
  if (!current || !previous) return 'stable';
  
  const difference = ((current - previous) / previous) * 100;
  
  if (Math.abs(difference) < 5) return 'stable';
  return difference > 0 ? 'up' : 'down';
};

/**
 * Validate QE data structure
 * @param {Object} data - QE data to validate
 * @returns {boolean} True if data structure is valid
 */
export const validateQEData = (data) => {
  if (!data || typeof data !== 'object') return false;
  
  const requiredFields = [
    'repo_with_highest_automation_failures',
    'repo_with_longest_automation',
    'repos_with_automation_avg_duration',
    'repos_with_failures',
    'pr_delivery_heatmap'
  ];
  
  return requiredFields.every(field => data.hasOwnProperty(field));
};

/**
 * Get color intensity for heatmap cells
 * @param {number} value - Cell value
 * @param {number} maxValue - Maximum value in dataset
 * @returns {number} Intensity between 0 and 1
 */
export const getHeatmapIntensity = (value, maxValue) => {
  if (!value || !maxValue) return 0;
  return Math.min(value / maxValue, 1);
};

/**
 * Format heatmap tooltip text
 * @param {Object} cellData - Cell data object
 * @returns {string} Formatted tooltip text
 */
export const formatHeatmapTooltip = (cellData) => {
  const { repo, date, v: count, developers } = cellData;
  
  let tooltip = `${repo.toUpperCase()}\n${new Date(date).toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  })}\n${count} PR${count !== 1 ? 's' : ''}`;
  
  if (developers && developers.length > 0) {
    tooltip += `\nDevelopers: ${developers.join(', ')}`;
  }
  
  return tooltip;
};

/**
 * Get repository display name
 * @param {string} repoName - Repository name
 * @returns {string} Formatted repository name
 */
export const getRepoDisplayName = (repoName) => {
  if (!repoName) return 'Unknown Repository';
  
  // Convert to uppercase and replace hyphens with spaces for better readability
  return repoName.toUpperCase().replace(/-/g, ' ');
};

/**
 * Sort repositories by criteria
 * @param {Array} repos - Array of repository objects
 * @param {string} sortBy - Sort criteria ('name', 'duration', 'failures')
 * @param {string} order - Sort order ('asc', 'desc')
 * @returns {Array} Sorted repository array
 */
export const sortRepositories = (repos, sortBy = 'name', order = 'asc') => {
  if (!repos || !Array.isArray(repos)) return [];
  
  const sortedRepos = [...repos].sort((a, b) => {
    let valueA, valueB;
    
    switch (sortBy) {
      case 'duration':
        valueA = a.avg_automation_duration_mins || 0;
        valueB = b.avg_automation_duration_mins || 0;
        break;
      case 'failures':
        valueA = a.failure_count || 0;
        valueB = b.failure_count || 0;
        break;
      case 'name':
      default:
        valueA = a.repo || '';
        valueB = b.repo || '';
        break;
    }
    
    if (typeof valueA === 'string') {
      return order === 'asc' 
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
    
    return order === 'asc' ? valueA - valueB : valueB - valueA;
  });
  
  return sortedRepos;
};

const qeDataTransformers = {
  transformForQEMetricCards,
  transformForAutomationDurationChart,
  transformForFailuresChart,
  transformForHeatmap,
  formatTime,
  calculatePercentage,
  getTrendDirection,
  validateQEData,
  getHeatmapIntensity,
  formatHeatmapTooltip,
  getRepoDisplayName,
  sortRepositories
};

export default qeDataTransformers;
