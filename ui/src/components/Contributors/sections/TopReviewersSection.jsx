import React from 'react';
import PropTypes from 'prop-types';
import AvatarList from '../components/AvatarList';
import Widget from '../components/Widget';
import { chartColors } from '../utils/chartDataUtils';

/**
 * TopReviewersSection - Displays the top reviewers with avatars
 * 
 * @param {Object} props - Component props
 * @param {Array} props.topReviewers - Array of top reviewers data
 */
const TopReviewersSection = ({ topReviewers }) => {
  return (
    <Widget 
      title="Top Reviewers"
      subtitle="Most active code reviewers"
      className="top-reviewers-avatars"
    >
      <AvatarList
        items={topReviewers}
        colors={chartColors.contributorsColors}
        countLabel="reviews"
        emptyMessage="No top reviewers data available for this period"
      />
    </Widget>
  );
};

TopReviewersSection.propTypes = {
  topReviewers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      reviews: PropTypes.number.isRequired
    })
  )
};

export default TopReviewersSection;
