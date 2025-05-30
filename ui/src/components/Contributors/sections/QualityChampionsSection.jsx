import React from 'react';
import PropTypes from 'prop-types';
import TableDisplay from '../components/TableDisplay';
import Widget from '../components/Widget';
import { chartColors } from '../utils/chartDataUtils';

/**
 * QualityChampionsSection - Displays the code quality champions in a table
 * 
 * @param {Object} props - Component props
 * @param {Array} props.qualityChampions - Array of code quality champions data
 */
const QualityChampionsSection = ({ qualityChampions }) => {
  return (
    <Widget 
      title="Code Quality Champions"
      subtitle="Improved the most pull requests"
      className="quality-champions"
    >
      <TableDisplay
        items={qualityChampions}
        colors={chartColors.contributorsColors}
        countLabel="PR Flags"
        emptyMessage="No code quality champions data available for this period"
      />
    </Widget>
  );
};

QualityChampionsSection.propTypes = {
  qualityChampions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      prs_flagged: PropTypes.number.isRequired
    })
  )
};

export default QualityChampionsSection;
