import React from 'react';
import PropTypes from 'prop-types';
import { formatAPITimestampForDisplay } from '../../../utils/dateUtils';

/**
 * TableRow component for rendering a single row in the pull request table
 * Extracts row rendering logic for better maintainability
 */
const TableRow = ({ pr, index }) => {
  return (
    <tr>
      <td>{index + 1}</td>
      <td>
        {pr.Jira_URL ? (
          <a 
            href={pr.Jira_URL} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="pr-link"
            aria-label={`Open Jira ticket ${pr.Jira_ID}`}
          >
            {pr.Jira_ID}
          </a>
        ) : (
          pr.Jira_ID || '-'
        )}
      </td>
      <td>{pr.repository}</td>
      <td>
        {pr.PR_URL ? (
          <a 
            href={pr.PR_URL} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="pr-link"
            aria-label={`Open pull request ${pr.PRNumber}`}
          >
            {pr.PRNumber}
          </a>
        ) : ('-')}
      </td>
      <td>
        <span className={`pr-status pr-status-${pr.State?.toLowerCase().replace(/\s+/g, '-')}`}>
          {pr.State}
        </span>
      </td>
      <td>{formatAPITimestampForDisplay(pr.ReviewRequestedTime)}</td>
      <td>{formatAPITimestampForDisplay(pr.MergedDate)}</td>
      <td>{pr.Author || '-'}</td>
    </tr>
  );
};

TableRow.propTypes = {
  pr: PropTypes.shape({
    rowNumber: PropTypes.number,
    Jira_ID: PropTypes.string,
    Jira_URL: PropTypes.string,
    repository: PropTypes.string,
    PRNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    PR_URL: PropTypes.string,
    State: PropTypes.string,
    ReviewRequestedTime: PropTypes.string,
    MergedDate: PropTypes.string,
    Author: PropTypes.string
  }).isRequired,
  index: PropTypes.number.isRequired
};

export default TableRow;
