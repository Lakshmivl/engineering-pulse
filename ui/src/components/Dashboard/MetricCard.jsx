import React from 'react';
import PropTypes from 'prop-types';
import './Dashboard.css';

/**
 * MetricCard component for displaying PR metrics with icons
 * @param {Object} props - Component props
 * @param {string} props.title - Title of the metric
 * @param {string|number} props.value - Value of the metric
 * @param {React.ReactNode} props.icon - Icon for the metric
 */
const MetricCard = ({ title, value, icon = null }) => {
  return (
    <div className="metric-card">
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
  icon: PropTypes.node
};

export default MetricCard;
