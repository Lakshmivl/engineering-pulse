import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, LineElement, PointElement, BarController, LineController, DoughnutController } from 'chart.js';
import './CICDMetrics.css';

// Import custom hooks
import useCICDData from './hooks/useCICDData';

// Import data transformers
import { 
  transformForMetricCards, 
  transformForPieChart, 
  transformForBuildDurationsChart,
  transformForPipelineDurationsChart,
  transformForStackedBarChart,
  validateCICDData 
} from './utils/cicdDataTransformers';

// Import reusable components
import { StateWrapper } from '../shared/ui/StateComponents';
import Widget from '../Contributors/components/Widget';

// Import Dashboard MetricCard for consistency
import MetricCard from '../Dashboard/MetricCard';

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend, BarController, LineController, DoughnutController);

/**
 * CICDMetrics component for displaying CI/CD pipeline metrics
 * @param {Object} props - Component props
 * @param {string} props.isoStartDate - ISO formatted start date
 * @param {string} props.isoEndDate - ISO formatted end date
 * @param {number} props.refreshKey - Numeric key that changes to trigger a data refresh in the component
 */
const CICDMetrics = ({ isoStartDate, isoEndDate, refreshKey }) => {
  // Use custom hook for data fetching and state management
  const { cicdData, loading, error, refreshData } = useCICDData(
    isoStartDate, 
    isoEndDate, 
    refreshKey
  );

  // Memoize transformed data to avoid unnecessary recalculations
  const transformedData = useMemo(() => {
    if (!cicdData || !validateCICDData(cicdData)) return null;

    return {
      metricCards: transformForMetricCards(cicdData),
      pieChart: transformForPieChart(cicdData.stage_failure_distribution),
      buildDurationsChart: transformForBuildDurationsChart(cicdData.build_durations_by_repo),
      pipelineDurationsChart: transformForPipelineDurationsChart(cicdData.pipeline_durations_by_repo),
      stackedBarChart: transformForStackedBarChart(cicdData.stage_breakdown)
    };
  }, [cicdData]);

  // Define a retry function for error state
  const handleRetry = () => {
    refreshData();
  };

  return (
    <div className="cicd-metrics">
      <StateWrapper
        isLoading={loading}
        isError={error !== null}
        isEmpty={!loading && !error && !cicdData}
        loadingMessage="Loading CI/CD metrics data..."
        errorMessage={error || 'Failed to load CI/CD metrics data'}
        emptyMessage="No CI/CD metrics data available for the selected date range"
        onRetry={handleRetry}
      >
        {transformedData && (
          <>
            {/* Metric Cards Row */}
            <div className="cicd-metrics-cards">
              <MetricCard
                title={transformedData.metricCards.slowestBuild.title}
                value={transformedData.metricCards.slowestBuild.value}
                subtitle={transformedData.metricCards.slowestBuild.subtitle}
                trend={transformedData.metricCards.slowestBuild.trend}
                icon="⏱️"
                className="metric-card-small-value"
              />
              <MetricCard
                title={transformedData.metricCards.longestPipeline.title}
                value={transformedData.metricCards.longestPipeline.value}
                subtitle={transformedData.metricCards.longestPipeline.subtitle}
                trend={transformedData.metricCards.longestPipeline.trend}
                icon="🔄"
                className="metric-card-small-value"
              />
              <MetricCard
                title={transformedData.metricCards.successRate.title}
                value={transformedData.metricCards.successRate.value}
                subtitle={transformedData.metricCards.successRate.subtitle}
                trend={transformedData.metricCards.successRate.trend}
                icon="✅"
              />
              <MetricCard
                title={transformedData.metricCards.failureRate.title}
                value={transformedData.metricCards.failureRate.value}
                subtitle={transformedData.metricCards.failureRate.subtitle}
                trend={transformedData.metricCards.failureRate.trend}
                icon="❌"
              />
            </div>

            {/* Build and Pipeline Duration Charts Row */}
            <div className="cicd-charts-container">
              {/* Average Build Duration by Repository Chart */}
              <Widget 
                title="Average Build Duration by Repository" 
                subtitle="Measured in minutes per pipeline run"
                className="cicd-chart-widget"
              >
                {transformedData.buildDurationsChart && (
                  <div className="horizontal-bar-chart">
                    <canvas 
                      ref={(canvas) => {
                        if (canvas && transformedData.buildDurationsChart) {
                          const ctx = canvas.getContext('2d');
                          // Clear any existing chart
                          if (canvas.chart) {
                            canvas.chart.destroy();
                          }
                          // Create new chart
                          canvas.chart = new ChartJS(ctx, {
                            type: 'bar',
                            data: transformedData.buildDurationsChart,
                            options: {
                              responsive: true,
                              maintainAspectRatio: false,
                              scales: {
                                x: {
                                  grid: {
                                    display: false
                                  },
                                  title: {
                                    display: true,
                                    text: 'Repository'
                                  }
                                },
                                y: {
                                  beginAtZero: true,
                                  title: {
                                    display: true,
                                    text: 'Duration (minutes)'
                                  }
                                }
                              },
                              plugins: {
                                legend: {
                                  display: false
                                },
                                tooltip: {
                                  callbacks: {
                                    label: function(context) {
                                      return `${context.parsed.y}m`;
                                    }
                                  }
                                }
                              }
                            }
                          });
                        }
                      }}
                      height="300"
                    />
                  </div>
                )}
              </Widget>

              {/* Longest Running Pipeline Chart */}
              <Widget 
                title="Average Pipeline Duration by Repository" 
                subtitle="End-to-end runtime of workflows in minutes"
                className="cicd-chart-widget"
              >
                {transformedData.pipelineDurationsChart && (
                  <div className="horizontal-bar-chart">
                    <canvas 
                      ref={(canvas) => {
                        if (canvas && transformedData.pipelineDurationsChart) {
                          const ctx = canvas.getContext('2d');
                          // Clear any existing chart
                          if (canvas.chart) {
                            canvas.chart.destroy();
                          }
                          // Create new chart
                          canvas.chart = new ChartJS(ctx, {
                            type: 'bar',
                            data: transformedData.pipelineDurationsChart,
                            options: {
                              responsive: true,
                              maintainAspectRatio: false,
                              scales: {
                                x: {
                                  grid: {
                                    display: false
                                  },
                                  title: {
                                    display: true,
                                    text: 'Repository'
                                  }
                                },
                                y: {
                                  beginAtZero: true,
                                  title: {
                                    display: true,
                                    text: 'Duration (minutes)'
                                  }
                                }
                              },
                              plugins: {
                                legend: {
                                  display: false
                                },
                                tooltip: {
                                  callbacks: {
                                    label: function(context) {
                                      return `${context.parsed.y}m`;
                                    }
                                  }
                                }
                              }
                            }
                          });
                        }
                      }}
                      height="300"
                    />
                  </div>
                )}
              </Widget>
            </div>

            {/* Charts Row */}
            <div className="cicd-charts-container">
              {/* Pipeline Efficiency */}
              <Widget 
                title="Pipeline Efficiency: Time Spent per Stage and Repository" 
                subtitle="Time spent in each build stage by repository"
                className="cicd-chart-widget"
              >
                {transformedData.stackedBarChart && (
                  <div className="stacked-bar-chart">
                    <canvas 
                      ref={(canvas) => {
                        if (canvas && transformedData.stackedBarChart) {
                          const ctx = canvas.getContext('2d');
                          // Clear any existing chart
                          if (canvas.chart) {
                            canvas.chart.destroy();
                          }
                          // Create new chart
                          canvas.chart = new ChartJS(ctx, {
                            type: 'bar',
                            data: transformedData.stackedBarChart,
                            options: {
                              responsive: true,
                              maintainAspectRatio: false,
                              scales: {
                                x: {
                                  stacked: true,
                                  grid: {
                                    display: false
                                  }
                                },
                                y: {
                                  stacked: true,
                                  beginAtZero: true,
                                  title: {
                                    display: true,
                                    text: 'Time (minutes)'
                                  }
                                }
                              },
                              plugins: {
                                legend: {
                                  position: 'top'
                                },
                                tooltip: {
                                  mode: 'index',
                                  intersect: false,
                                  callbacks: {
                                    label: function(context) {
                                      return `${context.dataset.label}: ${context.parsed.y}m`;
                                    }
                                  }
                                }
                              }
                            }
                          });
                        }
                      }}
                      height="300"
                    />
                  </div>
                )}
              </Widget>

              {/* Stages Causing Most Failures */}
              <Widget 
                title="Stages Causing Most Failures" 
                subtitle="Distribution of failures across pipeline stages"
                className="cicd-chart-widget"
              >
                {transformedData.pieChart && (
                  <div className="doughnut-chart">
                    <canvas 
                      ref={(canvas) => {
                        if (canvas && transformedData.pieChart) {
                          const ctx = canvas.getContext('2d');
                          // Clear any existing chart
                          if (canvas.chart) {
                            canvas.chart.destroy();
                          }
                          // Create new chart
                          canvas.chart = new ChartJS(ctx, {
                            type: 'doughnut',
                            data: transformedData.pieChart,
                            options: {
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  position: 'bottom',
                                  labels: {
                                    padding: 20,
                                    usePointStyle: true,
                                    font: {
                                      size: 12
                                    }
                                  }
                                },
                                tooltip: {
                                  callbacks: {
                                    label: function(context) {
                                      return `${context.label}: ${context.parsed}%`;
                                    }
                                  }
                                }
                              }
                            }
                          });
                        }
                      }}
                      height="300"
                    />
                  </div>
                )}
              </Widget>
            </div>
          </>
        )}
      </StateWrapper>
    </div>
  );
};

CICDMetrics.propTypes = {
  /** ISO formatted start date for the date range */
  isoStartDate: PropTypes.string.isRequired,
  /** ISO formatted end date for the date range */
  isoEndDate: PropTypes.string.isRequired,
  /** Numeric key that changes to trigger a data refresh */
  refreshKey: PropTypes.number.isRequired
};

export default CICDMetrics;
