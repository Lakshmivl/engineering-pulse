import React from 'react';
import PropTypes from 'prop-types';
import DateRangePicker from '../DateRangePicker/DateRangePicker';
import { RefreshCcw } from 'lucide-react';
import './Header.css';

/**
 * Header component containing the logo, refresh button and date range picker
 * @param {Object} props - Component props
 * @param {Date} props.startDate - Start date for date range
 * @param {Date} props.endDate - End date for date range
 * @param {Function} props.onDateChange - Callback function for date changes
 * @param {Function} props.onRefresh - Callback function for page refresh
 */
const Header = ({ startDate, endDate, onDateChange, onRefresh }) => {
  return (
    <header className="app-header">
      <div className="logo-container">
        <div className="logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
            <rect width="2.8" height="12" x="1" y="6" fill="#333333">
              <animate attributeName="y" begin="svgSpinnersBarsScaleMiddle0.begin+0.4s" calcMode="spline" dur="0.6s" keySplines=".14,.73,.34,1;.65,.26,.82,.45" values="6;1;6"/>
              <animate attributeName="height" begin="svgSpinnersBarsScaleMiddle0.begin+0.4s" calcMode="spline" dur="0.6s" keySplines=".14,.73,.34,1;.65,.26,.82,.45" values="12;22;12"/>
            </rect>
            <rect width="2.8" height="12" x="5.8" y="6" fill="#555555">
              <animate attributeName="y" begin="svgSpinnersBarsScaleMiddle0.begin+0.2s" calcMode="spline" dur="0.6s" keySplines=".14,.73,.34,1;.65,.26,.82,.45" values="6;1;6"/>
              <animate attributeName="height" begin="svgSpinnersBarsScaleMiddle0.begin+0.2s" calcMode="spline" dur="0.6s" keySplines=".14,.73,.34,1;.65,.26,.82,.45" values="12;22;12"/>
            </rect>
            <rect width="2.8" height="12" x="10.6" y="6" fill="#777777">
              <animate id="svgSpinnersBarsScaleMiddle0" attributeName="y" begin="0;svgSpinnersBarsScaleMiddle1.end-0.1s" calcMode="spline" dur="0.6s" keySplines=".14,.73,.34,1;.65,.26,.82,.45" values="6;1;6"/>
              <animate attributeName="height" begin="0;svgSpinnersBarsScaleMiddle1.end-0.1s" calcMode="spline" dur="0.6s" keySplines=".14,.73,.34,1;.65,.26,.82,.45" values="12;22;12"/>
            </rect>
            <rect width="2.8" height="12" x="15.4" y="6" fill="#999999">
              <animate attributeName="y" begin="svgSpinnersBarsScaleMiddle0.begin+0.2s" calcMode="spline" dur="0.6s" keySplines=".14,.73,.34,1;.65,.26,.82,.45" values="6;1;6"/>
              <animate attributeName="height" begin="svgSpinnersBarsScaleMiddle0.begin+0.2s" calcMode="spline" dur="0.6s" keySplines=".14,.73,.34,1;.65,.26,.82,.45" values="12;22;12"/>
            </rect>
            <rect width="2.8" height="12" x="20.2" y="6" fill="#bbbbbb">
              <animate id="svgSpinnersBarsScaleMiddle1" attributeName="y" begin="svgSpinnersBarsScaleMiddle0.begin+0.4s" calcMode="spline" dur="0.6s" keySplines=".14,.73,.34,1;.65,.26,.82,.45" values="6;1;6"/>
              <animate attributeName="height" begin="svgSpinnersBarsScaleMiddle0.begin+0.4s" calcMode="spline" dur="0.6s" keySplines=".14,.73,.34,1;.65,.26,.82,.45" values="12;22;12"/>
            </rect>
          </svg>
          <h1>Engineering Pulse</h1>
        </div>
      </div>
      <div className="header-actions">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onDateChange={onDateChange}
        />
        <button
          className="refresh-btn"
          onClick={onRefresh}
          title="Refresh PR data"
        >
          <RefreshCcw className="refresh-icon" />
        </button>
      </div>
    </header>
  );
};

Header.propTypes = {
  startDate: PropTypes.instanceOf(Date).isRequired,
  endDate: PropTypes.instanceOf(Date).isRequired,
  onDateChange: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired
};

export default Header;
