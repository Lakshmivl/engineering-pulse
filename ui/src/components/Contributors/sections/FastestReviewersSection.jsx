import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import HorizontalBarChart from '../charts/HorizontalBarChart';
import Widget from '../components/Widget';
import { prepareFastestReviewersData, chartConfigs } from '../utils/chartDataUtils';

/**
 * FastestReviewersSection - Displays the Fastest Reviewers horizontal bar chart
 * 
 * @param {Object} props - Component props
 * @param {Array} props.fastestReviewers - Array of fastest reviewers data
 */
const FastestReviewersSection = ({ fastestReviewers }) => {
  // Prepare data for chart with memoization
  const { chartData, hasData } = useMemo(() => 
    prepareFastestReviewersData(
      fastestReviewers,
      'rgba(65, 105, 225, 0.8)',
      'rgba(65, 105, 225, 1)'
    ),
  [fastestReviewers]);

  return (
    <Widget 
      title="Fastest Response Reviewers"
      subtitle="Quickly helped the most reviews"
      className="fastest-reviewers"
    >
      <HorizontalBarChart
        data={chartData}
        options={chartConfigs.horizontalBarOptions}
        hasData={hasData}
        emptyMessage="No fastest reviewers data available for this period"
        height={200}
      />
    </Widget>
  );
};

FastestReviewersSection.propTypes = {
  fastestReviewers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      avg_response_time_hrs: PropTypes.number.isRequired
    })
  )
};

export default FastestReviewersSection;
