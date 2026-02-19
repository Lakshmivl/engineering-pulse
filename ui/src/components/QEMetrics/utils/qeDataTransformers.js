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
    },
    automationCoverage: {
      title: 'Automation Coverage',
      value: `${qeData.qe_automation_coverage_percentage || 0}%`,
      subtitle: '% of merged PRs that had automation',
      trend: 'positive'
    },
    flakyRuns: {
      title: 'Flaky Runs',
      value: `${qeData.flaky_automation_percentage || 0}%`,
      subtitle: 'PRs where automation failed first, passed on retry',
      trend: 'negative'
    }
  };
};

/**
 * Transform QE data for Sprint Test Automation Results combined chart
 * @param {Array} repoRunSummary - Repository run summary data
 * @returns {Object} Formatted data for combined chart (bars + line)
 */
export const transformForSprintTestAutomationResults = (repoRunSummary) => {
  if (!repoRunSummary || !Array.isArray(repoRunSummary) || repoRunSummary.length === 0) return null;

  const labels = repoRunSummary.map(item => item.repo.toUpperCase());
  const passedData = repoRunSummary.map(item => item.total_runs - item.failure_count);
  const failedData = repoRunSummary.map(item => item.failure_count);
  const durationData = repoRunSummary.map(item => Math.round(item.avg_duration_mins * 10) / 10);

  return {
    labels,
    datasets: [
      {
        label: 'Passed',
        data: passedData,
        backgroundColor: '#3B82F6',
        borderColor: '#2563EB',
        borderWidth: 1,
        type: 'bar',
        yAxisID: 'y'
      },
      {
        label: 'Failed',
        data: failedData,
        backgroundColor: '#EF4444',
        borderColor: '#DC2626',
        borderWidth: 1,
        type: 'bar',
        yAxisID: 'y'
      },
      {
        label: 'Avg Duration',
        data: durationData,
        borderColor: '#F59E0B',
        backgroundColor: '#F59E0B',
        borderWidth: 3,
        type: 'line',
        yAxisID: 'y1',
        tension: 0.3,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBorderWidth: 2,
        pointBorderColor: '#FFFFFF',
        pointBackgroundColor: '#F59E0B',
        fill: false,
        order: 0
      }
    ]
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

  // Helper function to extract date string from ISO datetime in UTC
  const getUTCDateString = (isoString) => {
    const date = new Date(isoString);
    return date.getUTCFullYear() + '-' + 
           String(date.getUTCMonth() + 1).padStart(2, '0') + '-' + 
           String(date.getUTCDate()).padStart(2, '0');
  };

  // Helper function to get UTC date string from date input
  const getDateString = (dateInput) => {
    let date;
    if (typeof dateInput === 'string' && dateInput.includes('T')) {
      date = new Date(dateInput);
    } else if (typeof dateInput === 'string' && dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
      date = new Date(dateInput + 'T00:00:00.000Z');
    } else {
      date = new Date(dateInput);
    }
    return getUTCDateString(date.toISOString());
  };

  const startDateString = getDateString(startDate);
  const endDateString = getDateString(endDate);

  // Filter data by date range using UTC date strings
  const filteredData = heatmapData.filter(item => {
    const mergeDateString = getUTCDateString(item.merged_date);
    return mergeDateString >= startDateString && mergeDateString <= endDateString;
  });

  console.log('Heatmap filtering:', {
    startDateString,
    endDateString,
    totalItems: heatmapData.length,
    filteredItems: filteredData.length,
    sampleData: heatmapData.slice(0, 2).map(item => ({
      original: item.merged_date,
      extracted: getUTCDateString(item.merged_date)
    }))
  });

  if (filteredData.length === 0) {
    return {
      labels: { x: [], y: [] },
      data: []
    };
  }

  // Create date range array using UTC dates
  const dateRange = [];
  const start = new Date(startDateString + 'T00:00:00.000Z');
  const end = new Date(endDateString + 'T00:00:00.000Z');
  
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const dateStr = d.getUTCFullYear() + '-' + 
                   String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + 
                   String(d.getUTCDate()).padStart(2, '0');
    dateRange.push(dateStr);
  }

  // Get unique repositories from filtered data
  const repos = [...new Set(filteredData.map(item => item.repo))].sort();

  // Create matrix data
  const matrixData = [];
  repos.forEach((repo, repoIndex) => {
    dateRange.forEach((date, dateIndex) => {
      const dayData = filteredData.filter(item => 
        item.repo === repo && 
        getUTCDateString(item.merged_date) === date
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
    'pr_delivery_heatmap',
    'qe_automation_coverage_percentage',
    'flaky_automation_percentage',
    'repo_run_summary'
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
  transformForSprintTestAutomationResults,
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
