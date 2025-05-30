import React from 'react';

/**
 * Collection of SVG icons used in metric cards and other components
 * Centralizing icons improves maintainability and allows for easier updates
 */

export const TotalPRsIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="#4169e1">
    <path d="M8 3a2 2 0 00-2 2v4a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2H8zm0 2h8v4H8V5zm10 8a2 2 0 00-2 2v4a2 2 0 002 2h2a2 2 0 002-2v-4a2 2 0 00-2-2h-2zm0 2h2v4h-2v-4zM2 13a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4zm2 0v4h2v-4H4zm6 0a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4zm2 0v4h2v-4h-2z"/>
  </svg>
);

export const PRsMergedIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="#4169e1">
    <path d="M17 3a4 4 0 014 4 4 4 0 01-4 4V7h-7v10h7v-4a4 4 0 014 4 4 4 0 01-4 4 4 4 0 01-4-4h-2v4H7v-4a4 4 0 01-4-4 4 4 0 014-4 4 4 0 014 4V7a4 4 0 014-4zm0 2a2 2 0 00-2 2v8a2 2 0 002 2 2 2 0 002-2 2 2 0 00-2-2V7a2 2 0 002-2 2 2 0 00-2-2zM7 15a2 2 0 00-2 2 2 2 0 002 2 2 2 0 002-2 2 2 0 00-2-2z"/>
  </svg>
);

export const CycleTimeIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="#4169e1">
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
  </svg>
);

export const PRsToProductionIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="#4169e1">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>
);

export const LoCToProductionIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="#4169e1">
    <path d="M3 3h18v2H3V3zm0 4h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z"/>
  </svg>
);

export const ReviewTimeIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="#4169e1">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
  </svg>
);

export const PRSizeIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="#4169e1">
    <path d="M3 5h2V3H3v2zm0 4h2V7H3v2zm0 4h2v-2H3v2zm0 4h2v-2H3v2zM7 5h14V3H7v2zm0 4h14V7H7v2zm0 4h14v-2H7v2zm0 4h14v-2H7v2z"/>
  </svg>
);

/**
 * Generic metric icon with default props and customization
 */
export const MetricIcon = ({ iconType, color = "#4169e1", size = 24 }) => {
  const iconProps = {
    width: size,
    height: size,
    fill: color,
  };

  switch (iconType) {
    case 'totalPRs':
      return <TotalPRsIcon {...iconProps} />;
    case 'prsMerged':
      return <PRsMergedIcon {...iconProps} />;
    case 'cycleTime':
      return <CycleTimeIcon {...iconProps} />;
    case 'prsToProduction':
      return <PRsToProductionIcon {...iconProps} />;
    case 'locToProduction':
      return <LoCToProductionIcon {...iconProps} />;
    case 'reviewTime':
      return <ReviewTimeIcon {...iconProps} />;
    case 'prSize':
      return <PRSizeIcon {...iconProps} />;
    default:
      return null;
  }
};

const MetricIconsExport = {
  TotalPRsIcon,
  PRsMergedIcon,
  CycleTimeIcon,
  PRsToProductionIcon,
  LoCToProductionIcon,
  ReviewTimeIcon,
  PRSizeIcon,
  MetricIcon
};

export default MetricIconsExport;
