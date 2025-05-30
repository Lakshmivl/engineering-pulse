import React from 'react';
import PropTypes from 'prop-types';

/**
 * Widget - A reusable container component for section content
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - The content to be rendered inside the widget
 * @param {String} props.title - The widget title
 * @param {String} props.subtitle - The widget subtitle or description
 * @param {String} props.className - Additional CSS class for the widget
 */
const Widget = ({ 
  children, 
  title, 
  subtitle, 
  className = '' 
}) => {
  return (
    <div className={`widget-card ${className}`}>
      <h3 className="widget-title">{title}</h3>
      {subtitle && <p className="widget-subtitle">{subtitle}</p>}
      {children}
    </div>
  );
};

Widget.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  className: PropTypes.string
};

export default Widget;
