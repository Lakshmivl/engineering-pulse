/**
 * Data transformation utilities for CICD Metrics
 * Transforms API data into formats suitable for different chart types
 */

/**
 * Transform CICD data for pie chart visualization (failure stages)
 * @param {Array} stageFailureDistribution - Stage failure distribution data
 * @returns {Object} Formatted data for pie chart
 */
export const transformForPieChart = (stageFailureDistribution) => {
  if (!stageFailureDistribution || !Array.isArray(stageFailureDistribution)) return null;

  const labels = stageFailureDistribution.map(item => 
    item.stage.replace('_', ' ').toUpperCase()
  );
  const data = stageFailureDistribution.map(item => item.failures);
  
  // Calculate percentages
  const total = data.reduce((sum, value) => sum + value, 0);
  const percentages = data.map(value => Math.round((value / total) * 100));

  const colors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return {
    labels,
    datasets: [{
      data: percentages,
      backgroundColor: colors.slice(0, labels.length),
      borderWidth: 2,
      borderColor: '#FFFFFF'
    }]
  };
};

/**
 * Transform CICD data for build durations bar chart
 * @param {Array} buildDurationsData - Build durations by repo data
 * @returns {Object} Formatted data for horizontal bar chart
 */
export const transformForBuildDurationsChart = (buildDurationsData) => {
  if (!buildDurationsData || !Array.isArray(buildDurationsData)) return null;

  const labels = buildDurationsData.map(item => item.repo.toUpperCase());
  const data = buildDurationsData.map(item => item.avg_build_duration_mins);

  return {
    labels,
    datasets: [{
      label: 'Avg Build Duration (mins)',
      data,
      backgroundColor: '#F59E0B',
      borderColor: '#D97706',
      borderWidth: 1
    }]
  };
};

/**
 * Transform CICD data for pipeline durations bar chart
 * @param {Array} pipelineDurationsData - Pipeline durations by repo data
 * @returns {Object} Formatted data for horizontal bar chart
 */
export const transformForPipelineDurationsChart = (pipelineDurationsData) => {
  if (!pipelineDurationsData || !Array.isArray(pipelineDurationsData)) return null;

  const labels = pipelineDurationsData.map(item => item.repo.toUpperCase());
  const data = pipelineDurationsData.map(item => item.avg_pipeline_duration_mins);

  return {
    labels,
    datasets: [{
      label: 'Avg Pipeline Duration (mins)',
      data,
      backgroundColor: '#3B82F6',
      borderColor: '#2563EB',
      borderWidth: 1
    }]
  };
};

/**
 * Transform CICD data for horizontal bar chart (build times)
 * @param {Array} stageBreakdownData - Stage breakdown data
 * @param {string} metric - Metric to display ('build', 'sonar', 'unit_test', 'deploy')
 * @returns {Object} Formatted data for horizontal bar chart
 */
export const transformForHorizontalBarChart = (stageBreakdownData, metric = 'build') => {
  if (!stageBreakdownData || !Array.isArray(stageBreakdownData)) return null;

  const labels = stageBreakdownData.map(item => item.repo.toUpperCase());
  const data = stageBreakdownData.map(item => item.stages[metric] || 0);

  return {
    labels,
    datasets: [{
      label: `${metric.replace('_', ' ').toUpperCase()} Time (mins)`,
      data,
      backgroundColor: '#8B5CF6',
      borderColor: '#7C3AED',
      borderWidth: 1
    }]
  };
};

/**
 * Transform CICD data for stacked bar chart (stage breakdown)
 * @param {Array} stageBreakdownData - Stage breakdown data
 * @returns {Object} Formatted data for stacked bar chart
 */
export const transformForStackedBarChart = (stageBreakdownData) => {
  if (!stageBreakdownData || !Array.isArray(stageBreakdownData)) return null;

  const labels = stageBreakdownData.map(item => item.repo.toUpperCase());
  
  // Define stage colors
  const stageColors = {
    build: '#3B82F6',
    sonar: '#10B981', 
    unit_test: '#8B5CF6',
    deploy: '#F59E0B'
  };

  // Get all unique stages
  const allStages = new Set();
  stageBreakdownData.forEach(item => {
    Object.keys(item.stages).forEach(stage => allStages.add(stage));
  });

  const datasets = Array.from(allStages).map(stage => ({
    label: stage.replace('_', ' ').toUpperCase(),
    data: stageBreakdownData.map(item => item.stages[stage] || 0),
    backgroundColor: stageColors[stage] || '#6B7280'
  }));

  return {
    labels,
    datasets
  };
};

/**
 * Transform CICD data for metric cards
 * @param {Object} cicdData - Complete CICD API response
 * @returns {Object} Formatted data for metric cards
 */
export const transformForMetricCards = (cicdData) => {
  if (!cicdData) return null;

  return {
    slowestBuild: {
      title: 'Slowest Building Repo',
      value: `${cicdData.slowest_build_repo?.repo?.toUpperCase() || 'N/A'} (${cicdData.slowest_build_repo?.avg_build_time_mins || 0}m)`,
      subtitle: 'Average build duration',
      trend: 'neutral'
    },
    longestPipeline: {
      title: 'Longest Running Pipeline',
      value: `${cicdData.longest_pipeline_repo?.repo?.toUpperCase() || 'N/A'} (${cicdData.longest_pipeline_repo?.avg_total_pipeline_time_mins || 0}m)`,
      subtitle: 'Average pipeline duration',
      trend: 'neutral'
    },
    successRate: {
      title: 'Pipeline Success Rate',
      value: `${cicdData.pipeline_success_rate?.success_percentage || 0}%`,
      subtitle: `${cicdData.pipeline_success_rate?.successful_runs || 0}/${cicdData.pipeline_success_rate?.total_runs || 0} runs`,
      trend: cicdData.pipeline_success_rate?.success_percentage >= 90 ? 'positive' : 'negative'
    },
    failureRate: {
      title: 'Build Failure Rate',
      value: `${cicdData.build_failure_rate?.failure_percentage || 0}%`,
      subtitle: `${cicdData.build_failure_rate?.failed_builds || 0}/${cicdData.build_failure_rate?.total_builds || 0} builds`,
      trend: cicdData.build_failure_rate?.failure_percentage <= 10 ? 'positive' : 'negative'
    }
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
 * Validate CICD data structure
 * @param {Object} data - CICD data to validate
 * @returns {boolean} True if data structure is valid
 */
export const validateCICDData = (data) => {
  if (!data || typeof data !== 'object') return false;
  
  const requiredFields = [
    'slowest_build_repo',
    'longest_pipeline_repo', 
    'pipeline_success_rate',
    'build_failure_rate',
    'build_durations_by_repo',
    'pipeline_durations_by_repo',
    'stage_breakdown',
    'stage_causing_most_failures',
    'stage_failure_distribution'
  ];
  
  return requiredFields.every(field => data.hasOwnProperty(field));
};

const cicdDataTransformers = {
  transformForPieChart,
  transformForBuildDurationsChart,
  transformForPipelineDurationsChart,
  transformForHorizontalBarChart,
  transformForStackedBarChart,
  transformForMetricCards,
  formatTime,
  calculatePercentage,
  getTrendDirection,
  validateCICDData
};

export default cicdDataTransformers;
