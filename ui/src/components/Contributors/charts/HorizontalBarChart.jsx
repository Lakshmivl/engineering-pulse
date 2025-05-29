import React from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';

/**
 * HorizontalBarChart - A reusable horizontal bar chart component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - Chart data object with datasets and labels
 * @param {Object} props.options - Chart.js options for the bar chart
 * @param {Boolean} props.hasData - Whether or not there is data to display
 * @param {String} props.emptyMessage - Message to display when no data is available
 * @param {Number} props.height - Height for the chart (default: 200)
 */
const HorizontalBarChart = ({ 
  data, 
  options, 
  hasData, 
  emptyMessage = 'No data available for this period',
  height = 200
}) => {
  if (!hasData) {
    return (
      <div className="empty-widget-message">{emptyMessage}</div>
    );
  }

  return (
    <div className="chart-container">
      <Bar data={data} options={options} height={height} />
    </div>
  );
};

HorizontalBarChart.propTypes = {
  data: PropTypes.shape({
    labels: PropTypes.array.isRequired,
    datasets: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        data: PropTypes.array.isRequired,
        backgroundColor: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.array
        ]).isRequired,
        borderColor: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.array
        ]),
        borderWidth: PropTypes.number,
      })
    ).isRequired,
  }).isRequired,
  options: PropTypes.object.isRequired,
  hasData: PropTypes.bool.isRequired,
  emptyMessage: PropTypes.string,
  height: PropTypes.number,
};

export default HorizontalBarChart;
