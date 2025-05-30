import React from 'react';
import PropTypes from 'prop-types';

/**
 * AvatarList - A reusable component for displaying a list of avatars with names and counts
 * 
 * @param {Object} props - Component props
 * @param {Array} props.items - Array of items, each with a name and count property
 * @param {Array} props.colors - Array of colors for the avatars
 * @param {String} props.countLabel - Label for the count (e.g., "reviews")
 * @param {String} props.emptyMessage - Message to display when no data is available
 */
const AvatarList = ({ 
  items, 
  colors, 
  countLabel = "reviews",
  emptyMessage = "No data available for this period" 
}) => {
  if (!items || items.length === 0) {
    return <div className="empty-widget-message">{emptyMessage}</div>;
  }

  return (
    <div className="avatars-container">
      {items.map((item, index) => {
        // Get initial for avatar
        const initial = item.name.charAt(0);
        
        // Generate background color
        const avatarColor = colors[index % colors.length];
        
        return (
          <div key={index} className="avatar-item">
            <div 
              className="avatar-circle" 
              style={{ 
                backgroundColor: avatarColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px'
              }}
            >
              {initial}
            </div>
            <div className="avatar-name">{item.name}</div>
            <div className="review-count">
              {item.reviews || item.prs_delivered || item.unique_repos_reviewed} {countLabel}
            </div>
          </div>
        );
      })}
    </div>
  );
};

AvatarList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      reviews: PropTypes.number,
      prs_delivered: PropTypes.number,
      unique_repos_reviewed: PropTypes.number
      // At least one of the count properties should be present
    })
  ).isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  countLabel: PropTypes.string,
  emptyMessage: PropTypes.string
};

export default AvatarList;
