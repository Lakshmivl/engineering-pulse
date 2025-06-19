import React from 'react';
import PropTypes from 'prop-types';
import './Dashboard.css';

/**
 * MetricCard component for displaying PR metrics with icons
 * @param {Object} props - Component props
 * @param {string} props.title - Title of the metric
 * @param {string|number} props.value - Value of the metric
 * @param {React.ReactNode} props.icon - Icon for the metric
 * @param {string} props.className - Additional CSS class for styling
 */
const MetricCard = ({ title, value, icon = null, className = '' }) => {
  return (
    <div className={`metric-card ${className}`}>
      <div className="metric-icon">
        {icon}
      </div>
      <div className="metric-content">
        <h3 className="metric-title">{title}</h3>
        <div className="metric-value">{value}</div>
      </div>
    </div>
  );
};

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node,
  className: PropTypes.string
};

export default MetricCard;
