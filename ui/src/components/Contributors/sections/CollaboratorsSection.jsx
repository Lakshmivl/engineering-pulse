import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import DoughnutChartWithLegend from '../charts/DoughnutChartWithLegend';
import { prepareCollaboratorsData, chartConfigs, chartColors } from '../utils/chartDataUtils';

/**
 * CollaboratorsSection - Displays the Code Collaborators doughnut chart
 * 
 * @param {Object} props - Component props
 * @param {Array} props.collaborators - Array of collaborator data
 */
const CollaboratorsSection = ({ collaborators }) => {
  // Prepare data for chart with memoization
  const { chartData, legendData } = useMemo(() => 
    prepareCollaboratorsData(
      collaborators, 
      chartColors.collaboratorsColors
    ),
  [collaborators]);

  return (
    <div className="chart-widget">
      <h4 className="chart-title">Code Collaborators</h4>
      <p>Crossed team boundaries to review</p>
      
      <div className="chart-content">
        <DoughnutChartWithLegend
          data={chartData}
          options={chartConfigs.doughnutOptions}
          legendData={legendData}
          colors={chartColors.collaboratorsColors}
          emptyMessage="No cross-repo collaboration data available for this period"
        />
      </div>
    </div>
  );
};

CollaboratorsSection.propTypes = {
  collaborators: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      unique_repos_reviewed: PropTypes.number.isRequired
    })
  )
};

export default CollaboratorsSection;
