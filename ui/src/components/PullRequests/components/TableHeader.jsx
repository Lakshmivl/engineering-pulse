import React from 'react';
import PropTypes from 'prop-types';

/**
 * TableHeader component for the pull request table
 * Extracts the header row logic for better organization
 */
const TableHeader = ({ 
  sortConfig, 
  onSort 
}) => {
  const getSortDirectionIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' 
      ? <span className="sort-icon">▲</span> 
      : <span className="sort-icon">▼</span>;
  };

  return (
    <thead>
      <tr>
        <th onClick={() => onSort('rowNumber')} className={sortConfig.key === 'rowNumber' ? 'sorted-column' : ''}>
          S.No {getSortDirectionIcon('rowNumber')}
        </th>
        <th onClick={() => onSort('Jira_ID')} className={sortConfig.key === 'Jira_ID' ? 'sorted-column' : ''}>
          Jira Ticket {getSortDirectionIcon('Jira_ID')}
        </th>
        <th onClick={() => onSort('repository')} className={sortConfig.key === 'repository' ? 'sorted-column' : ''}>
          Repository {getSortDirectionIcon('repository')}
        </th>
        <th onClick={() => onSort('PRNumber')} className={sortConfig.key === 'PRNumber' ? 'sorted-column' : ''}>
          Pull Request {getSortDirectionIcon('PRNumber')}
        </th>
        <th onClick={() => onSort('State')} className={sortConfig.key === 'State' ? 'sorted-column' : ''}>
          PR Status {getSortDirectionIcon('State')}
        </th>
        <th onClick={() => onSort('CreatedDate')} className={sortConfig.key === 'CreatedDate' ? 'sorted-column' : ''}>
          Review Requested Date {getSortDirectionIcon('CreatedDate')}
        </th>
        <th onClick={() => onSort('MergedDate')} className={sortConfig.key === 'MergedDate' ? 'sorted-column' : ''}>
          Merged Date {getSortDirectionIcon('MergedDate')}
        </th>
        <th onClick={() => onSort('Author')} className={sortConfig.key === 'Author' ? 'sorted-column' : ''}>
          Author {getSortDirectionIcon('Author')}
        </th>
      </tr>
    </thead>
  );
};

TableHeader.propTypes = {
  sortConfig: PropTypes.shape({
    key: PropTypes.string,
    direction: PropTypes.oneOf(['asc', 'desc'])
  }).isRequired,
  onSort: PropTypes.func.isRequired
};

export default TableHeader;
