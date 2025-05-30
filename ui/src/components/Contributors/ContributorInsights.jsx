import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, LineElement, PointElement, BarController, LineController, DoughnutController } from 'chart.js';
import './Contributors.css';

// Import custom hooks
import useContributorData from './hooks/useContributorData';

// Import section components
import TopReviewersSection from './sections/TopReviewersSection';
import TopContributorsSection from './sections/TopContributorsSection';
import CollaboratorsSection from './sections/CollaboratorsSection';
import ReviewSpeedSection from './sections/ReviewSpeedSection';
import FastestReviewersSection from './sections/FastestReviewersSection';
import QualityChampionsSection from './sections/QualityChampionsSection';

// Import reusable components
import { StateWrapper } from '../shared/ui/StateComponents';

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend, BarController, LineController, DoughnutController);

/**
 * ContributorInsights component for displaying contributor metrics
 * @param {Object} props - Component props
 * @param {string} props.isoStartDate - ISO formatted start date
 * @param {string} props.isoEndDate - ISO formatted end date
 * @param {number} props.refreshKey - Numeric key that changes to trigger a data refresh in the component
 */
const ContributorInsights = ({ isoStartDate, isoEndDate, refreshKey }) => {
  // Use custom hook for data fetching and state management
  const { contributorData, loading, error, refreshData } = useContributorData(
    isoStartDate, 
    isoEndDate, 
    refreshKey
  );

  // Define a retry function for error state
  const handleRetry = () => {
    refreshData();
  };

  return (
    <div className="contributor-insights">
      <StateWrapper
        isLoading={loading}
        isError={error !== null}
        isEmpty={!loading && !error && !contributorData}
        loadingMessage="Loading contributor data..."
        errorMessage={error || 'Failed to load contributor data'}
        emptyMessage="No contributor data available for the selected date range"
        onRetry={handleRetry}
      >
        {contributorData && (
          <>
            {/* Top Reviewers Section */}
            <TopReviewersSection 
              topReviewers={contributorData.top_reviewers} 
            />
            
            {/* Side-by-side pie charts row */}
            <div className="contributors-container">
              <div className="charts-container">
                {/* Top Contributors */}
                <TopContributorsSection 
                  impactfulContributors={contributorData.impactful_contributors} 
                />

                {/* Code Collaborators */}
                <CollaboratorsSection 
                  collaborators={contributorData.cross_repo_champions} 
                />
              </div>
            </div>

            {/* PR Volume & Review Speed Chart */}
            <ReviewSpeedSection 
              reviewSpeedData={contributorData.review_speed_chart} 
            />
            
            {/* Main widget grid for remaining widgets */}
            <div className="widgets-grid">
              {/* Code Quality Champions */}
              <QualityChampionsSection 
                qualityChampions={contributorData.code_quality_champions} 
              />

              {/* Fastest Response Reviewers */}
              <FastestReviewersSection 
                fastestReviewers={contributorData.fastest_reviewers} 
              />
            </div>
          </>
        )}
      </StateWrapper>
    </div>
  );
};

export default ContributorInsights;
