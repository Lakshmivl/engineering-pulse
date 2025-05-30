import React from 'react';
import PropTypes from 'prop-types';

/**
 * Collection of reusable UI components for various application states
 * These components provide a consistent UX for loading, error, and empty states
 */

/**
 * Loading state component with optional customization
 */
export const LoadingState = ({ 
  message = 'Loading data...', 
  className = '',
  showSpinner = true 
}) => (
  <div className={`loading-container ${className}`}>
    {showSpinner && (
      <div className="loading-spinner">
        <div className="spinner-circle"></div>
      </div>
    )}
    <p className="loading-message">{message}</p>
  </div>
);

LoadingState.propTypes = {
  message: PropTypes.string,
  className: PropTypes.string,
  showSpinner: PropTypes.bool
};

/**
 * Loading skeleton for dashboard metrics
 */
export const MetricsLoadingSkeleton = ({ count = 5 }) => (
  <div className="metrics-skeleton">
    {[...Array(count)].map((_, index) => (
      <div key={index} className="metric-skeleton-item">
        <div className="skeleton-header"></div>
        <div className="skeleton-value"></div>
      </div>
    ))}
  </div>
);

MetricsLoadingSkeleton.propTypes = {
  count: PropTypes.number
};

/**
 * Error state component with optional retry functionality
 */
export const ErrorState = ({ 
  message = 'An error occurred while fetching data.', 
  details = null,
  onRetry = null,
  className = ''
}) => (
  <div className={`error-container ${className}`}>
    <div className="error-icon">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
    <h3 className="error-title">Data Loading Error</h3>
    <p className="error-message">{message}</p>
    {details && <p className="error-details">{details}</p>}
    {onRetry && (
      <button className="retry-button" onClick={onRetry}>
        Try Again
      </button>
    )}
  </div>
);

ErrorState.propTypes = {
  message: PropTypes.string,
  details: PropTypes.string,
  onRetry: PropTypes.func,
  className: PropTypes.string
};

/**
 * Empty state component for when no data is available
 */
export const EmptyState = ({ 
  message = 'No data available for the selected date range.',
  icon = null,
  className = '',
  actionButton = null
}) => (
  <div className={`empty-container ${className}`}>
    {icon || (
      <div className="empty-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M13 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V9l-7-7z" />
          <path d="M13 3v6h6" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="16" y2="17" />
          <line x1="10" y1="9" x2="11" y2="9" />
        </svg>
      </div>
    )}
    <p className="empty-message">{message}</p>
    {actionButton}
  </div>
);

EmptyState.propTypes = {
  message: PropTypes.string,
  icon: PropTypes.node,
  className: PropTypes.string,
  actionButton: PropTypes.node
};

/**
 * Wrapper component that handles loading, error, and empty states automatically
 */
export const StateWrapper = ({
  isLoading,
  isError,
  isEmpty,
  loadingMessage = 'Loading data...',
  errorMessage = 'An error occurred while fetching data.',
  emptyMessage = 'No data available for the selected date range.',
  onRetry = null,
  children
}) => {
  if (isLoading) {
    return <LoadingState message={loadingMessage} />;
  }

  if (isError) {
    return <ErrorState message={errorMessage} onRetry={onRetry} />;
  }

  if (isEmpty) {
    return <EmptyState message={emptyMessage} />;
  }

  return children;
};

StateWrapper.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  isEmpty: PropTypes.bool.isRequired,
  loadingMessage: PropTypes.string,
  errorMessage: PropTypes.string,
  emptyMessage: PropTypes.string,
  onRetry: PropTypes.func,
  children: PropTypes.node.isRequired
};
