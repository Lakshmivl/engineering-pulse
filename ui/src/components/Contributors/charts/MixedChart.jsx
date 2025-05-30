import React from 'react';
import PropTypes from 'prop-types';
import { Chart } from 'react-chartjs-2';

/**
 * MixedChart - A reusable component for mixed chart types (bar and line)
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - Chart data object with datasets and labels
 * @param {Object} props.options - Chart.js options for the mixed chart
 * @param {Boolean} props.hasData - Whether or not there is data to display
 * @param {String} props.emptyMessage - Message to display when no data is available
 * @param {Number} props.height - Height for the chart (default: 250)
 */
const MixedChart = ({ 
  data, 
  options, 
  hasData, 
  emptyMessage = 'No data available for this period',
  height = 250
}) => {
  if (!hasData) {
    return (
      <div className="empty-widget-message">{emptyMessage}</div>
    );
  }

  return (
    <div className="chart-container">
      <Chart type="bar" data={data} options={options} height={height} />
    </div>
  );
};

MixedChart.propTypes = {
  data: PropTypes.shape({
    labels: PropTypes.array.isRequired,
    datasets: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
        label: PropTypes.string.isRequired,
        data: PropTypes.array.isRequired,
        backgroundColor: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.array
        ]),
        borderColor: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.array
        ]),
        borderWidth: PropTypes.number,
        // Other optional chart.js properties
        stack: PropTypes.string,
        order: PropTypes.number,
        yAxisID: PropTypes.string,
        tension: PropTypes.number,
        pointRadius: PropTypes.number,
        pointBackgroundColor: PropTypes.string,
        pointBorderColor: PropTypes.string,
        pointBorderWidth: PropTypes.number,
      })
    ).isRequired,
  }).isRequired,
  options: PropTypes.object.isRequired,
  hasData: PropTypes.bool.isRequired,
  emptyMessage: PropTypes.string,
  height: PropTypes.number,
};

export default MixedChart;
