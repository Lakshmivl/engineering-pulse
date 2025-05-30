import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Navigation from './components/Navigation/Navigation';
import DashboardOverview from './components/Dashboard/DashboardOverview';
import ContributorInsights from './components/Contributors/ContributorInsights';
import PullRequestTable from './components/PullRequests/PullRequestTable';
import { getDefaultDateRange, formatDateToISO } from './utils/dateUtils';
import './App.css';

/**
 * Main App component that orchestrates the entire application
 */
function App() {
  // Get default date range (today and 30 days ago)
  const defaultDateRange = getDefaultDateRange();
  
  // State for date range
  const [startDate, setStartDate] = useState(defaultDateRange.startDate);
  const [endDate, setEndDate] = useState(defaultDateRange.endDate);
  
  // State for ISO formatted dates to use in API calls
  const [isoStartDate, setIsoStartDate] = useState(formatDateToISO(defaultDateRange.startDate));
  const [isoEndDate, setIsoEndDate] = useState(formatDateToISO(defaultDateRange.endDate));
  
  // Refresh key to trigger data reload in children
  const [refreshKey, setRefreshKey] = useState(0);

  // Format dates when they change
  useEffect(() => {
    setIsoStartDate(formatDateToISO(startDate));
    setIsoEndDate(formatDateToISO(endDate));
  }, [startDate, endDate]);

  /**
   * Handle date range change from the date picker
   * @param {Date} newStartDate - New start date
   * @param {Date} newEndDate - New end date
   */
  const handleDateChange = (newStartDate, newEndDate) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  /**
   * Handle manual refresh by updating the refreshKey
   */
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="app">
      <Header 
        startDate={startDate}
        endDate={endDate}
        onDateChange={handleDateChange}
        onRefresh={handleRefresh}
      />
      <Navigation />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route 
            path="/dashboard" 
            element={
              <DashboardOverview 
                startDate={startDate}
                endDate={endDate}
                isoStartDate={isoStartDate}
                isoEndDate={isoEndDate}
                refreshKey={refreshKey}
              />
            } 
          />
          <Route 
            path="/contributors" 
            element={
              <ContributorInsights 
                isoStartDate={isoStartDate}
                isoEndDate={isoEndDate}
                refreshKey={refreshKey}
              />
            } 
          />
          <Route 
            path="/pullrequests" 
            element={
              <PullRequestTable 
                isoStartDate={isoStartDate}
                isoEndDate={isoEndDate}
                refreshKey={refreshKey}
              />
            } 
          />
          <Route path="*" element={<div className="error-container">Page not found.</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
