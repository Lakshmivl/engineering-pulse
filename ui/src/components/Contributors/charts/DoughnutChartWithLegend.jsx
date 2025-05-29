import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';

/**
 * DoughnutChartWithLegend - A reusable doughnut chart with custom legend
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - Chart data object with datasets and labels
 * @param {Object} props.options - Chart.js options for the doughnut chart
 * @param {Array} props.legendData - Data to populate the legend
 * @param {Array} props.colors - Array of colors used in the chart
 * @param {String} props.emptyMessage - Message to display when no data is available
 */
const DoughnutChartWithLegend = ({ 
  data, 
  options, 
  legendData, 
  colors, 
  emptyMessage = 'No data available for this period' 
}) => {
  // Determine if we have valid data to display
  const hasData = useMemo(() => 
    legendData && 
    legendData.length > 0 && 
    data && 
    data.datasets && 
    data.datasets.length > 0, 
  [legendData, data]);

  if (!hasData) {
    return (
      <div className="empty-widget-message">{emptyMessage}</div>
    );
  }

  return (
    <div className="pie-chart-container">
      <div className="pie-chart">
        <Doughnut data={data} options={options} />
      </div>
      <div className="chart-legend">
        {legendData.map((item, index) => (
          <div key={index} className="legend-item">
            <span 
              className="legend-color" 
              style={{ backgroundColor: colors[index % colors.length] }}
            ></span>
            <span className="legend-label">{item.name.split('-')[0]}</span>
            <span className="legend-value">
              ({item.prs_delivered || item.unique_repos_reviewed})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

DoughnutChartWithLegend.propTypes = {
  data: PropTypes.shape({
    labels: PropTypes.array.isRequired,
    datasets: PropTypes.arrayOf(
      PropTypes.shape({
        data: PropTypes.array.isRequired,
        backgroundColor: PropTypes.array.isRequired,
        borderColor: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        borderWidth: PropTypes.number,
        hoverOffset: PropTypes.number,
      })
    ).isRequired,
  }).isRequired,
  options: PropTypes.object.isRequired,
  legendData: PropTypes.array.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  emptyMessage: PropTypes.string,
};

export default DoughnutChartWithLegend;
