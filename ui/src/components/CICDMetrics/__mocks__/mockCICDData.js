/**
 * Mock data for CICD Metrics testing
 * Contains comprehensive test data matching the API contract
 */

export const MOCK_CICD_DATA = {
  slowest_build_repo: {
    repo: "SAP Commerce",
    avg_build_time_mins: 14
  },
  longest_pipeline_repo: {
    repo: "AEM",
    avg_total_pipeline_time_mins: 34
  },
  pipeline_success_rate: {
    total_runs: 200,
    successful_runs: 190,
    success_percentage: 95.0
  },
  build_failure_rate: {
    total_builds: 200,
    failed_builds: 16,
    failure_percentage: 8.0
  },
  build_durations_by_repo: [
    {
      repo: "AEM",
      avg_build_duration_mins: 5
    },
    {
      repo: "React",
      avg_build_duration_mins: 9
    },
    {
      repo: "Services",
      avg_build_duration_mins: 12
    },
    {
      repo: "SAP Commerce",
      avg_build_duration_mins: 14
    }
  ],
  pipeline_durations_by_repo: [
    {
      repo: "AEM",
      avg_pipeline_duration_mins: 34
    },
    {
      repo: "React",
      avg_pipeline_duration_mins: 28
    },
    {
      repo: "Services",
      avg_pipeline_duration_mins: 32
    }
  ],
  stage_breakdown: [
    {
      repo: "AEM",
      stages: {
        build: 5.2,
        deploy: 3.1,
        automation: 12.0
      }
    },
    {
      repo: "React",
      stages: {
        build: 6.5,
        deploy: 4.8,
        automation: 10.3
      }
    }
  ],
  stage_causing_most_failures: {
    stage: "build",
    failure_count: 42,
    failure_percentage: 78.0
  },
  stage_failure_distribution: [
    {
      stage: "build",
      failures: 42
    },
    {
      stage: "automation",
      failures: 12
    }
  ]
};

export const MOCK_CICD_LOADING = {
  loading: true,
  data: null,
  error: null
};

export const MOCK_CICD_ERROR = {
  loading: false,
  data: null,
  error: "Failed to fetch CICD data"
};

export const MOCK_CICD_EMPTY = {
  loading: false,
  data: null,
  error: null
};

export const MOCK_TRANSFORMED_CHART_DATA = {
  pieChart: {
    labels: ['Unit Test', 'Build', 'Deploy', 'Sonar'],
    datasets: [{
      data: [35, 30, 25, 10],
      backgroundColor: ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B']
    }]
  },
  barChart: {
    labels: ['SAP Commerce', 'AEM Core', 'React Frontend'],
    datasets: [{
      label: 'Build Time (mins)',
      data: [12.5, 15.2, 8.1],
      backgroundColor: '#8B5CF6'
    }]
  },
  stackedBarChart: {
    labels: ['SAP Commerce', 'AEM Core', 'React Frontend'],
    datasets: [
      {
        label: 'Build',
        data: [12.5, 15.2, 8.1],
        backgroundColor: '#3B82F6'
      },
      {
        label: 'Sonar',
        data: [2.1, 1.8, 1.2],
        backgroundColor: '#10B981'
      },
      {
        label: 'Unit Test',
        data: [3.2, 2.9, 1.8],
        backgroundColor: '#8B5CF6'
      },
      {
        label: 'Deploy',
        data: [4.7, 9.0, 2.3],
        backgroundColor: '#F59E0B'
      }
    ]
  }
};

export default {
  MOCK_CICD_DATA,
  MOCK_CICD_LOADING,
  MOCK_CICD_ERROR,
  MOCK_CICD_EMPTY,
  MOCK_TRANSFORMED_CHART_DATA
};
