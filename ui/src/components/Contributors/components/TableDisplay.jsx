import React from 'react';
import PropTypes from 'prop-types';

/**
 * TableDisplay - A reusable component for displaying data in a table format with avatars
 * 
 * @param {Object} props - Component props
 * @param {Array} props.items - Array of items to display in the table
 * @param {Array} props.colors - Array of colors for the avatars
 * @param {String} props.countLabel - Label for the count column
 * @param {String} props.emptyMessage - Message to display when no data is available
 */
const TableDisplay = ({ 
  items, 
  colors, 
  countLabel = "PR Flags",
  emptyMessage = "No data available for this period" 
}) => {
  if (!items || items.length === 0) {
    return <div className="empty-widget-message">{emptyMessage}</div>;
  }

  return (
    <div className="quality-champions-table">
      <div className="table-header">
        <div className="table-cell avatar-cell">Avatar</div>
        <div className="table-cell name-cell">Name</div>
        <div className="table-cell count-cell">{countLabel}</div>
      </div>
      
      {items.map((item, index) => {
        // Get initials
        const initials = item.name.charAt(0);
        
        // Generate background color based on name
        const colorIndex = index % colors.length;
        const avatarColor = colors[colorIndex];
        
        return (
          <div key={index} className="table-row">
            <div className="table-cell avatar-cell">
              <div className="avatar-square" style={{ backgroundColor: avatarColor }}>
                {initials.toUpperCase()}
              </div>
            </div>
            <div className="table-cell name-cell">{item.name}</div>
            <div className="table-cell count-cell">
              {item.prs_flagged || item.reviews || item.unique_repos_reviewed}
            </div>
          </div>
        );
      })}
    </div>
  );
};

TableDisplay.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      prs_flagged: PropTypes.number,
      reviews: PropTypes.number,
      unique_repos_reviewed: PropTypes.number
      // At least one of the count properties should be present
    })
  ).isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  countLabel: PropTypes.string,
  emptyMessage: PropTypes.string
};

export default TableDisplay;
