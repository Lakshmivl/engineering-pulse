import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import MixedChart from '../charts/MixedChart';
import Widget from '../components/Widget';
import { prepareReviewSpeedChartData, chartConfigs } from '../utils/chartDataUtils';

/**
 * ReviewSpeedSection - Displays the PR Volume & Review Speed mixed chart
 * 
 * @param {Object} props - Component props
 * @param {Array} props.reviewSpeedData - Array of review speed data points
 */
const ReviewSpeedSection = ({ reviewSpeedData }) => {
  // Prepare data for chart with memoization
  const { chartData, hasData } = useMemo(() => 
    prepareReviewSpeedChartData(reviewSpeedData),
  [reviewSpeedData]);

  return (
    <Widget 
      title="PR Volume & Review Speed"
      subtitle="Pull request volume and average review time"
      className="review-speed-chart"
    >
      <MixedChart
        data={chartData}
        options={chartConfigs.reviewSpeedOptions}
        hasData={hasData}
        emptyMessage="No PR volume and review speed data available for this period"
        height={250}
      />
    </Widget>
  );
};

ReviewSpeedSection.propTypes = {
  reviewSpeedData: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      pr_volume: PropTypes.number.isRequired,
      avg_review_time_hrs: PropTypes.number.isRequired
    })
  )
};

export default ReviewSpeedSection;
