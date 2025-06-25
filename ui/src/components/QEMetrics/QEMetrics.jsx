import React, { useMemo, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, LineElement, PointElement, BarController, LineController, DoughnutController } from 'chart.js';
import './QEMetrics.css';

// Import custom hooks
import useQEData from './hooks/useQEData';

// Import data transformers
import { 
  transformForQEMetricCards, 
  transformForAutomationDurationChart,
  transformForFailuresChart,
  transformForHeatmap,
  validateQEData 
} from './utils/qeDataTransformers';

// Import reusable components
import { StateWrapper } from '../shared/ui/StateComponents';
import Widget from '../Contributors/components/Widget';

// Import Dashboard MetricCard for consistency
import MetricCard from '../Dashboard/MetricCard';

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend, BarController, LineController, DoughnutController);

/**
 * QEMetrics component for displaying QE automation and testing metrics
 * @param {Object} props - Component props
 * @param {string} props.isoStartDate - ISO formatted start date
 * @param {string} props.isoEndDate - ISO formatted end date
 * @param {number} props.refreshKey - Numeric key that changes to trigger a data refresh in the component
 */
const QEMetrics = ({ isoStartDate, isoEndDate, refreshKey }) => {
  // State for custom tooltip
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: null,
    clickedCellIndex: null
  });

  // Ref for tooltip hide timeout
  const hideTimeoutRef = useRef(null);
  const tooltipRef = useRef(null);

  // Use custom hook for data fetching and state management
  const { qeData, loading, error, refreshData } = useQEData(
    isoStartDate, 
    isoEndDate, 
    refreshKey
  );

  // Memoize transformed data to avoid unnecessary recalculations
  const transformedData = useMemo(() => {
    if (!qeData || !validateQEData(qeData)) return null;

    return {
      metricCards: transformForQEMetricCards(qeData),
      durationChart: transformForAutomationDurationChart(qeData.repos_with_automation_avg_duration),
      failuresChart: transformForFailuresChart(qeData.repos_with_failures),
      heatmap: transformForHeatmap(qeData.pr_delivery_heatmap, isoStartDate, isoEndDate)
    };
  }, [qeData, isoStartDate, isoEndDate]);

  // Cleanup effect to clear timeouts on unmount and add click outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltip.visible && tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        // Check if click is not on a heatmap cell
        const isHeatmapCell = event.target.closest('.heatmap-cell');
        if (!isHeatmapCell) {
          setTooltip(prev => ({ ...prev, visible: false }));
        }
      }
    };

    if (tooltip.visible) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      document.removeEventListener('click', handleClickOutside);
    };
  }, [tooltip.visible]);

  // Define a retry function for error state
  const handleRetry = () => {
    refreshData();
  };

  // Tooltip event handlers
  const handleCellClick = (event, cell, index) => {
    if (cell.jiraTickets && cell.jiraTickets.length > 0) {
      // Clear any existing timeouts
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      const rect = event.target.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      // Smart positioning: show below if near top, above if near bottom
      const showBelow = rect.top < viewportHeight / 3;
      
      let x = rect.left + rect.width / 2;
      let y = showBelow ? rect.bottom + 5 : rect.top - 5;
      
      // Ensure tooltip doesn't go off screen horizontally
      const tooltipWidth = 250; // max-width from CSS
      if (x + tooltipWidth / 2 > viewportWidth - 20) {
        x = viewportWidth - tooltipWidth / 2 - 20;
      } else if (x - tooltipWidth / 2 < 20) {
        x = tooltipWidth / 2 + 20;
      }

      setTooltip({
        visible: true,
        x: x,
        y: y,
        content: cell.jiraTickets,
        showBelow: showBelow,
        clickedCellIndex: index
      });
    }
  };


  return (
    <div className="qe-metrics">
      <StateWrapper
        isLoading={loading}
        isError={error !== null}
        isEmpty={!loading && !error && !qeData}
        loadingMessage="Loading QE metrics data..."
        errorMessage={error || 'Failed to load QE metrics data'}
        emptyMessage="No QE metrics data available for the selected date range"
        onRetry={handleRetry}
      >
        {transformedData && (
          <>
            {/* Metric Cards Row */}
            <div className="qe-metrics-cards">
              <MetricCard
                title={transformedData.metricCards.highestFailures.title}
                value={transformedData.metricCards.highestFailures.value}
                subtitle={transformedData.metricCards.highestFailures.subtitle}
                trend={transformedData.metricCards.highestFailures.trend}
                icon="⚠️"
                className="metric-card-small-value"
              />
              <MetricCard
                title={transformedData.metricCards.longestAutomation.title}
                value={transformedData.metricCards.longestAutomation.value}
                subtitle={transformedData.metricCards.longestAutomation.subtitle}
                trend={transformedData.metricCards.longestAutomation.trend}
                icon="⏱️"
                className="metric-card-small-value"
              />
            </div>

            {/* Heatmap Row */}
            <div className="qe-charts-container">
              <Widget 
                title="PR Delivery Performance Heatmap" 
                subtitle="Daily PR merge activity by repository (filtered by selected date range)"
                className="qe-chart-widget full-width"
              >
                {transformedData.heatmap && (
                  <div className="heatmap-container">
                    <div className="heatmap-grid">
                      {/* Y-axis labels (repositories) */}
                      <div className="heatmap-y-labels">
                        {transformedData.heatmap.labels.y.map((repo, index) => (
                          <div key={index} className="heatmap-y-label">
                            {repo.toUpperCase()}
                          </div>
                        ))}
                      </div>
                      
                      {/* Heatmap cells */}
                      <div className="heatmap-cells">
                        {/* X-axis labels (dates) */}
                        <div className="heatmap-x-labels">
                          {transformedData.heatmap.labels.x.map((date, index) => (
                            <div key={index} className="heatmap-x-label">
                              {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                          ))}
                        </div>
                        
                        {/* Grid cells */}
                        <div className="heatmap-grid-cells">
                          {transformedData.heatmap.data.map((cell, index) => {
                            const intensity = Math.min(cell.v / Math.max(...transformedData.heatmap.data.map(d => d.v)), 1);
                            return (
                              <div
                                key={index}
                                className="heatmap-cell"
                                onClick={(e) => handleCellClick(e, cell, index)}
                                style={{
                                  backgroundColor: `rgba(59, 130, 246, ${intensity})`,
                                  gridColumn: cell.x + 1,
                                  gridRow: cell.y + 1,
                                  cursor: cell.jiraTickets && cell.jiraTickets.length > 0 ? 'pointer' : 'default'
                                }}
                              >
                                {cell.v > 0 && <span className="heatmap-cell-value">{cell.v}</span>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                    {/* Heatmap legend */}
                    <div className="heatmap-legend">
                      <span className="heatmap-legend-label">Less</span>
                      <div className="heatmap-legend-scale">
                        {[0, 0.25, 0.5, 0.75, 1].map((intensity, index) => (
                          <div
                            key={index}
                            className="heatmap-legend-cell"
                            style={{ backgroundColor: `rgba(59, 130, 246, ${intensity})` }}
                          />
                        ))}
                      </div>
                      <span className="heatmap-legend-label">More</span>
                    </div>
                  </div>
                )}
              </Widget>
            </div>

            {/* Bar Charts Row */}
            <div className="qe-charts-container">
              {/* Test Automation Duration Chart */}
              <Widget 
                title="Average Test Automation Time by Repository" 
                subtitle="Avg. time to execute automated test suites"
                className="qe-chart-widget"
              >
                {transformedData.durationChart && (
                  <div className="horizontal-bar-chart">
                    <canvas 
                      ref={(canvas) => {
                        if (canvas && transformedData.durationChart) {
                          const ctx = canvas.getContext('2d');
                          // Clear any existing chart
                          if (canvas.chart) {
                            canvas.chart.destroy();
                          }
                          // Create new chart
                          canvas.chart = new ChartJS(ctx, {
                            type: 'bar',
                            data: transformedData.durationChart,
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

              {/* Test Failures Chart */}
              <Widget 
                title="Test Automation Failure Rate by Repository" 
                subtitle="% of automated test runs that failed"
                className="qe-chart-widget"
              >
                {transformedData.failuresChart && (
                  <div className="horizontal-bar-chart">
                    <canvas 
                      ref={(canvas) => {
                        if (canvas && transformedData.failuresChart) {
                          const ctx = canvas.getContext('2d');
                          // Clear any existing chart
                          if (canvas.chart) {
                            canvas.chart.destroy();
                          }
                          // Create new chart
                          canvas.chart = new ChartJS(ctx, {
                            type: 'bar',
                            data: transformedData.failuresChart,
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
                                    text: 'Failure Percentage (%)'
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
                                      const dataIndex = context.dataIndex;
                                      const failureData = qeData.repos_with_failures[dataIndex];
                                      return [
                                        `Failure Rate: ${context.parsed.y}%`,
                                        `Total Failures: ${failureData.failure_count}`
                                      ];
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
      
      {/* Custom Tooltip */}
      {tooltip.visible && tooltip.content && (
        <div 
          ref={tooltipRef}
          className="heatmap-custom-tooltip"
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y,
            transform: tooltip.showBelow 
              ? 'translateX(-50%)' 
              : 'translateX(-50%) translateY(-100%)',
            zIndex: 1000,
            pointerEvents: 'auto'
          }}
        >
          <div className="heatmap-tooltip-content">
            {tooltip.content.map((jiraTicket, index) => (
              <div key={index} className="heatmap-tooltip-item">
                <a 
                  href={jiraTicket.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="heatmap-jira-link"
                >
                  • {jiraTicket.id}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

QEMetrics.propTypes = {
  /** ISO formatted start date for the date range */
  isoStartDate: PropTypes.string.isRequired,
  /** ISO formatted end date for the date range */
  isoEndDate: PropTypes.string.isRequired,
  /** Numeric key that changes to trigger a data refresh */
  refreshKey: PropTypes.number.isRequired
};

export default QEMetrics;
