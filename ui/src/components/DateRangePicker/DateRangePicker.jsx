import React, { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { formatDateRangeForDisplay } from '../../utils/dateUtils';
import "react-datepicker/dist/react-datepicker.css";
import './DateRangePicker.css';

/**
 * Date range picker component for filtering PR metrics by date
 * @param {Object} props - Component props
 * @param {Date} props.startDate - Start date
 * @param {Date} props.endDate - End date
 * @param {Function} props.onDateChange - Callback function for date changes
 */
const DateRangePicker = ({ startDate, endDate, onDateChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);

  /**
   * Handles changing the start date
   * @param {Date} date - New start date
   */
  const handleStartDateChange = (date) => {
    setLocalStartDate(date);
  };

  /**
   * Handles changing the end date
   * @param {Date} date - New end date
   */
  const handleEndDateChange = (date) => {
    setLocalEndDate(date);
  };

  /**
   * Applies the selected date range and calls the parent callback
   */
  const applyDateRange = () => {
    onDateChange(localStartDate, localEndDate);
    setIsOpen(false);
  };

  /**
   * Cancels date selection and reverts to previous values
   */
  const cancelDateRange = () => {
    setLocalStartDate(startDate);
    setLocalEndDate(endDate);
    setIsOpen(false);
  };

  /**
   * Toggles the date picker dropdown
   */
  const toggleDatePicker = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // When opening, initialize with current values
      setLocalStartDate(startDate);
      setLocalEndDate(endDate);
    }
  };

  return (
    <div className="date-range-picker">
      <button className="date-display" onClick={toggleDatePicker}>
        {formatDateRangeForDisplay(startDate, endDate)}
        <span className="dropdown-arrow">▼</span>
      </button>

      {isOpen && (
        <div className="date-picker-dropdown">
          <div className="date-pickers">
            <div className="date-picker-section">
              <label>Start Date</label>
              <ReactDatePicker
                selected={localStartDate}
                onChange={handleStartDateChange}
                selectsStart
                startDate={localStartDate}
                endDate={localEndDate}
                maxDate={localEndDate}
                inline
              />
            </div>
            <div className="date-picker-section">
              <label>End Date</label>
              <ReactDatePicker
                selected={localEndDate}
                onChange={handleEndDateChange}
                selectsEnd
                startDate={localStartDate}
                endDate={localEndDate}
                minDate={localStartDate}
                maxDate={new Date()}
                inline
              />
            </div>
          </div>
          <div className="date-picker-actions">
            <button className="cancel-btn" onClick={cancelDateRange}>Cancel</button>
            <button className="apply-btn" onClick={applyDateRange}>Apply</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
