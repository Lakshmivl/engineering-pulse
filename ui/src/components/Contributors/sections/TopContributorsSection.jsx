import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import DoughnutChartWithLegend from '../charts/DoughnutChartWithLegend';
import { prepareTopContributorsData, chartConfigs, chartColors } from '../utils/chartDataUtils';

/**
 * TopContributorsSection - Displays the Top Contributors doughnut chart
 * 
 * @param {Object} props - Component props
 * @param {Array} props.impactfulContributors - Array of contributor data
 */
const TopContributorsSection = ({ impactfulContributors }) => {
  // Prepare data for chart with memoization
  const { chartData, legendData } = useMemo(() => 
    prepareTopContributorsData(
      impactfulContributors, 
      chartColors.contributorsColors
    ),
  [impactfulContributors]);

  return (
    <div className="chart-widget">
      <h4 className="chart-title">Top Contributors</h4>
      <p>Led this sprint's production momentum</p>
      
      <div className="chart-content">
        <DoughnutChartWithLegend
          data={chartData}
          options={chartConfigs.doughnutOptions}
          legendData={legendData}
          colors={chartColors.contributorsColors}
          emptyMessage="No top contributors data available for this period"
        />
      </div>
    </div>
  );
};

TopContributorsSection.propTypes = {
  impactfulContributors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      prs_delivered: PropTypes.number.isRequired
    })
  )
};

export default TopContributorsSection;
