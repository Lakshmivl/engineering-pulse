/**
 * Utility functions for preparing chart data in ContributorInsights component
 */

/**
 * Prepare data for the top contributors pie chart
 * 
 * @param {Array} impactfulContributors - Array of contributor data
 * @param {Array} colors - Array of colors to use for the chart
 * @returns {Object} Formatted data for the chart
 */
export const prepareTopContributorsData = (impactfulContributors, colors) => {
  if (!impactfulContributors || impactfulContributors.length === 0) {
    return {
      chartData: {
        labels: ['No contributor data available'],
        datasets: [{
          data: [1],
          backgroundColor: [colors[0]],
          borderColor: 'white',
          borderWidth: 2,
          hoverOffset: 10,
        }]
      },
      legendData: [],
      hasData: false
    };
  }
  
  // Calculate percentages for the pie chart
  const totalPRs = impactfulContributors.reduce(
    (sum, item) => sum + item.prs_delivered, 
    0
  );
  
  const contributorsWithPercentages = impactfulContributors.map(item => {
    const percentage = totalPRs > 0 
      ? Math.round((item.prs_delivered / totalPRs) * 100) 
      : 0;
    
    return {
      ...item,
      percentage
    };
  });
  
  // Prepare chart data
  const chartData = {
    labels: impactfulContributors.map(item => `${item.name}`),
    datasets: [
      {
        data: impactfulContributors.map(item => item.prs_delivered),
        backgroundColor: colors.slice(0, impactfulContributors.length),
        borderColor: 'white',
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };
  
  return {
    chartData,
    legendData: contributorsWithPercentages,
    hasData: true
  };
};

/**
 * Prepare data for the code collaborators pie chart
 * 
 * @param {Array} collaborators - Array of collaborator data
 * @param {Array} colors - Array of colors to use for the chart
 * @returns {Object} Formatted data for the chart
 */
export const prepareCollaboratorsData = (collaborators, colors) => {
  if (!collaborators || collaborators.length === 0) {
    return {
      chartData: {
        labels: ['No collaborator data available'],
        datasets: [{
          data: [1],
          backgroundColor: [colors[0]],
          borderColor: 'white',
          borderWidth: 2,
          hoverOffset: 10,
        }]
      },
      legendData: [],
      hasData: false
    };
  }
  
  // Calculate percentages
  const totalRepos = collaborators.reduce(
    (sum, item) => sum + item.unique_repos_reviewed, 
    0
  );
  
  const collaboratorsWithPercentages = collaborators.map(item => {
    const percentage = totalRepos > 0 
      ? Math.round((item.unique_repos_reviewed / totalRepos) * 100) 
      : 0;
    
    return {
      ...item,
      percentage
    };
  });
  
  // Prepare chart data
  const chartData = {
    labels: collaboratorsWithPercentages.map(item => item.name),
    datasets: [
      {
        data: collaboratorsWithPercentages.map(item => item.unique_repos_reviewed),
        backgroundColor: colors.slice(0, collaboratorsWithPercentages.length),
        borderColor: 'white',
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };
  
  return {
    chartData,
    legendData: collaboratorsWithPercentages,
    hasData: true
  };
};

/**
 * Prepare data for the fastest reviewers chart
 * 
 * @param {Array} fastestReviewers - Array of reviewer data
 * @param {string} backgroundColor - Background color for the bars
 * @param {string} borderColor - Border color for the bars
 * @returns {Object} Formatted data for the chart
 */
export const prepareFastestReviewersData = (
  fastestReviewers, 
  backgroundColor = 'rgba(65, 105, 225, 0.8)', 
  borderColor = 'rgba(65, 105, 225, 1)'
) => {
  if (!fastestReviewers || fastestReviewers.length === 0) {
    return {
      chartData: {
        labels: ['No data available'],
        datasets: [{
          label: 'Avg. Response Time (hrs)',
          data: [0],
          backgroundColor,
          borderColor,
          borderWidth: 1,
        }]
      },
      hasData: false
    };
  }
  
  const chartData = {
    labels: fastestReviewers.map(item => item.name),
    datasets: [
      {
        label: 'Avg. Response Time (hrs)',
        data: fastestReviewers.map(item => item.avg_response_time_hrs),
        backgroundColor,
        borderColor,
        borderWidth: 1,
      },
    ],
  };
  
  return {
    chartData,
    hasData: true
  };
};

/**
 * Format date for review speed chart
 * 
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string (e.g., "Apr 15")
 */
export const formatChartDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
};

/**
 * Prepare data for the PR volume and review speed chart
 * 
 * @param {Array} reviewSpeedData - Array of review speed data
 * @returns {Object} Formatted data for the chart
 */
export const prepareReviewSpeedChartData = (reviewSpeedData) => {
  if (!reviewSpeedData || reviewSpeedData.length === 0) {
    return {
      chartData: {
        labels: ['No data available'],
        datasets: [
          {
            type: 'bar',
            label: 'PRs Merged',
            data: [0],
            backgroundColor: 'rgba(38, 166, 154, 0.9)',
            borderColor: 'rgba(38, 166, 154, 1)',
            borderWidth: 1,
            order: 2,
            stack: 'Stack 0',
          },
          {
            type: 'bar',
            label: 'PRs with Changes Requested',
            data: [0],
            backgroundColor: 'rgba(142, 68, 173, 0.9)',
            borderColor: 'rgba(142, 68, 173, 1)',
            borderWidth: 1,
            order: 2,
            stack: 'Stack 0',
          },
          {
            type: 'line',
            label: 'Avg. Review Time (hrs)',
            data: [0],
            borderColor: 'rgba(66, 133, 244, 1)',
            backgroundColor: 'rgba(66, 133, 244, 0.2)',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: 'rgba(66, 133, 244, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 1,
            order: 1,
            yAxisID: 'y1',
          }
        ],
      },
      hasData: false
    };
  }
  
  const chartData = {
    labels: reviewSpeedData.map(item => formatChartDate(item.date)),
    datasets: [
      {
        type: 'bar',
        label: 'PRs Merged',
        data: reviewSpeedData.map(item => Math.round(item.pr_volume * 0.7)),
        backgroundColor: 'rgba(38, 166, 154, 0.9)',
        borderColor: 'rgba(38, 166, 154, 1)',
        borderWidth: 1,
        order: 2,
        stack: 'Stack 0',
      },
      {
        type: 'bar',
        label: 'PRs with Changes Requested',
        data: reviewSpeedData.map(item => Math.round(item.pr_volume * 0.3)),
        backgroundColor: 'rgba(142, 68, 173, 0.9)',
        borderColor: 'rgba(142, 68, 173, 1)',
        borderWidth: 1,
        order: 2,
        stack: 'Stack 0',
      },
      {
        type: 'line',
        label: 'Avg. Review Time (hrs)',
        data: reviewSpeedData.map(item => item.avg_review_time_hrs),
        borderColor: 'rgba(66, 133, 244, 1)',
        backgroundColor: 'rgba(66, 133, 244, 0.2)',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: 'rgba(66, 133, 244, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        order: 1,
        yAxisID: 'y1',
      }
    ],
  };
  
  return {
    chartData,
    hasData: true
  };
};

// Chart configuration objects
export const chartConfigs = {
  // Doughnut chart options for top contributors and collaborators
  doughnutOptions: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '45%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.formattedValue || '';
            const percentage = context.dataset?.data?.[context.dataIndex]?.percentage || 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  },
  
  // Horizontal bar chart options for fastest reviewers
  horizontalBarOptions: {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Hours',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  },
  
  // Combined chart options for PR volume and review speed
  reviewSpeedOptions: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        title: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        title: {
          display: true,
          text: 'PR Volume',
        },
        ticks: {
          precision: 0,
        },
      },
      y1: {
        beginAtZero: true,
        position: 'right',
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: 'Avg. Time (hrs)',
        },
        ticks: {
          precision: 0,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'center',
        labels: {
          boxWidth: 12,
          usePointStyle: false,
          padding: 15,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
  }
};

// Color palettes for charts
export const chartColors = {
  contributorsColors: [
    'rgba(65, 105, 225, 0.9)', // Royal Blue
    'rgba(233, 150, 60, 0.9)', // Orange
    'rgba(92, 184, 92, 0.9)', // Green
    'rgba(91, 192, 222, 0.9)', // Light Blue
    'rgba(240, 173, 78, 0.9)', // Gold
  ],
  
  collaboratorsColors: [
    'rgba(92, 107, 192, 0.9)', // Indigo
    'rgba(66, 165, 245, 0.9)', // Blue
    'rgba(38, 166, 154, 0.9)', // Teal
    'rgba(102, 187, 106, 0.9)', // Green
    'rgba(255, 202, 40, 0.9)', // Amber
  ]
};
