import {
  transformForPieChart,
  transformForHorizontalBarChart,
  transformForStackedBarChart,
  transformForMetricCards,
  formatTime,
  calculatePercentage,
  getTrendDirection,
  validateCICDData
} from './cicdDataTransformers';
import { MOCK_CICD_DATA } from '../__mocks__/mockCICDData';

describe('CICD Data Transformers', () => {
  describe('transformForPieChart', () => {
    test('transforms stage failure data correctly', () => {
      const stageFailureData = {
        stage: 'unit_test',
        failure_count: 14,
        failure_percentage: 35.0
      };

      const result = transformForPieChart(stageFailureData);

      expect(result).toEqual({
        labels: ['UNIT TEST', 'Other Stages'],
        datasets: [{
          data: [35.0, 65.0],
          backgroundColor: ['#8B5CF6', '#E5E7EB'],
          borderWidth: 2,
          borderColor: '#FFFFFF'
        }]
      });
    });

    test('handles null input', () => {
      const result = transformForPieChart(null);
      expect(result).toBe(null);
    });

    test('handles undefined input', () => {
      const result = transformForPieChart(undefined);
      expect(result).toBe(null);
    });

    test('handles stage names with underscores', () => {
      const stageFailureData = {
        stage: 'integration_test',
        failure_percentage: 25.0
      };

      const result = transformForPieChart(stageFailureData);
      expect(result.labels[0]).toBe('INTEGRATION TEST');
    });
  });

  describe('transformForHorizontalBarChart', () => {
    test('transforms stage breakdown data for build metric', () => {
      const stageBreakdownData = MOCK_CICD_DATA.stage_breakdown;
      const result = transformForHorizontalBarChart(stageBreakdownData, 'build');

      expect(result).toEqual({
        labels: ['SAP-COMMERCE', 'AEM-CORE', 'REACT-FRONTEND'],
        datasets: [{
          label: 'BUILD Time (mins)',
          data: [12.5, 15.2, 8.1],
          backgroundColor: '#8B5CF6',
          borderColor: '#7C3AED',
          borderWidth: 1
        }]
      });
    });

    test('transforms stage breakdown data for unit_test metric', () => {
      const stageBreakdownData = MOCK_CICD_DATA.stage_breakdown;
      const result = transformForHorizontalBarChart(stageBreakdownData, 'unit_test');

      expect(result.datasets[0].label).toBe('UNIT TEST Time (mins)');
      expect(result.datasets[0].data).toEqual([3.2, 2.9, 1.8]);
    });

    test('handles null input', () => {
      const result = transformForHorizontalBarChart(null);
      expect(result).toBe(null);
    });

    test('handles non-array input', () => {
      const result = transformForHorizontalBarChart({});
      expect(result).toBe(null);
    });

    test('handles missing metric in stage data', () => {
      const stageBreakdownData = [{
        repo: 'test-repo',
        stages: { build: 10.0 } // missing unit_test
      }];

      const result = transformForHorizontalBarChart(stageBreakdownData, 'unit_test');
      expect(result.datasets[0].data).toEqual([0]);
    });

    test('uses default metric when not specified', () => {
      const stageBreakdownData = MOCK_CICD_DATA.stage_breakdown;
      const result = transformForHorizontalBarChart(stageBreakdownData);

      expect(result.datasets[0].label).toBe('BUILD Time (mins)');
    });
  });

  describe('transformForStackedBarChart', () => {
    test('transforms stage breakdown data correctly', () => {
      const stageBreakdownData = MOCK_CICD_DATA.stage_breakdown;
      const result = transformForStackedBarChart(stageBreakdownData);

      expect(result.labels).toEqual(['SAP-COMMERCE', 'AEM-CORE', 'REACT-FRONTEND']);
      expect(result.datasets).toHaveLength(4); // build, sonar, unit_test, deploy
      
      const buildDataset = result.datasets.find(d => d.label === 'BUILD');
      expect(buildDataset.data).toEqual([12.5, 15.2, 8.1]);
      expect(buildDataset.backgroundColor).toBe('#3B82F6');
    });

    test('handles null input', () => {
      const result = transformForStackedBarChart(null);
      expect(result).toBe(null);
    });

    test('handles non-array input', () => {
      const result = transformForStackedBarChart({});
      expect(result).toBe(null);
    });

    test('handles missing stages in some repos', () => {
      const stageBreakdownData = [
        {
          repo: 'repo1',
          stages: { build: 10.0, unit_test: 5.0 }
        },
        {
          repo: 'repo2',
          stages: { build: 8.0, deploy: 3.0 }
        }
      ];

      const result = transformForStackedBarChart(stageBreakdownData);
      
      const unitTestDataset = result.datasets.find(d => d.label === 'UNIT TEST');
      expect(unitTestDataset.data).toEqual([5.0, 0]); // repo2 missing unit_test
    });

    test('assigns default color for unknown stages', () => {
      const stageBreakdownData = [{
        repo: 'test-repo',
        stages: { unknown_stage: 5.0 }
      }];

      const result = transformForStackedBarChart(stageBreakdownData);
      const unknownDataset = result.datasets.find(d => d.label === 'UNKNOWN STAGE');
      expect(unknownDataset.backgroundColor).toBe('#6B7280');
    });
  });

  describe('transformForMetricCards', () => {
    test('transforms complete CICD data correctly', () => {
      const result = transformForMetricCards(MOCK_CICD_DATA);

      expect(result.slowestBuild).toEqual({
        title: 'Slowest Building Repo',
        value: 'SAP-COMMERCE',
        subtitle: '17.5m',
        trend: 'neutral'
      });

      expect(result.successRate).toEqual({
        title: 'Pipeline Success Rate',
        value: '88%',
        subtitle: '132/150 runs',
        trend: 'negative' // 88% < 90%
      });

      expect(result.failureRate).toEqual({
        title: 'Build Failure Rate',
        value: '12%',
        subtitle: '18/150 builds',
        trend: 'negative' // 12% > 10%
      });
    });

    test('handles null input', () => {
      const result = transformForMetricCards(null);
      expect(result).toBe(null);
    });

    test('handles missing data fields', () => {
      const incompleteData = {
        slowest_build_repo: {},
        pipeline_success_rate: {},
        build_failure_rate: {}
      };

      const result = transformForMetricCards(incompleteData);

      expect(result.slowestBuild.value).toBe('N/A');
      expect(result.slowestBuild.subtitle).toBe('0m');
      expect(result.successRate.value).toBe('0%');
      expect(result.failureRate.value).toBe('0%');
    });

    test('sets positive trend for high success rate', () => {
      const dataWithHighSuccess = {
        ...MOCK_CICD_DATA,
        pipeline_success_rate: {
          total_runs: 100,
          successful_runs: 95,
          success_percentage: 95
        }
      };

      const result = transformForMetricCards(dataWithHighSuccess);
      expect(result.successRate.trend).toBe('positive');
    });

    test('sets positive trend for low failure rate', () => {
      const dataWithLowFailure = {
        ...MOCK_CICD_DATA,
        build_failure_rate: {
          total_builds: 100,
          failed_builds: 5,
          failure_percentage: 5
        }
      };

      const result = transformForMetricCards(dataWithLowFailure);
      expect(result.failureRate.trend).toBe('positive');
    });
  });

  describe('formatTime', () => {
    test('formats minutes correctly', () => {
      expect(formatTime(0)).toBe('< 1m');
      expect(formatTime(0.5)).toBe('< 1m');
      expect(formatTime(5)).toBe('5m');
      expect(formatTime(45)).toBe('45m');
    });

    test('formats hours and minutes correctly', () => {
      expect(formatTime(60)).toBe('1h');
      expect(formatTime(90)).toBe('1h 30m');
      expect(formatTime(125)).toBe('2h 5m');
      expect(formatTime(180)).toBe('3h');
    });

    test('handles null and undefined', () => {
      expect(formatTime(null)).toBe('< 1m');
      expect(formatTime(undefined)).toBe('< 1m');
    });

    test('rounds minutes properly', () => {
      expect(formatTime(5.7)).toBe('6m');
      expect(formatTime(65.3)).toBe('1h 5m');
    });
  });

  describe('calculatePercentage', () => {
    test('calculates percentage correctly', () => {
      expect(calculatePercentage(25, 100)).toBe(25.0);
      expect(calculatePercentage(1, 3)).toBe(33.3);
      expect(calculatePercentage(2, 3)).toBe(66.7);
    });

    test('handles zero total', () => {
      expect(calculatePercentage(5, 0)).toBe(0);
    });

    test('handles null values', () => {
      expect(calculatePercentage(null, 100)).toBe(0);
      expect(calculatePercentage(50, null)).toBe(0);
    });

    test('rounds to one decimal place', () => {
      expect(calculatePercentage(1, 6)).toBe(16.7); // 16.666... rounded
      expect(calculatePercentage(1, 7)).toBe(14.3); // 14.285... rounded
    });
  });

  describe('getTrendDirection', () => {
    test('returns correct trend directions', () => {
      expect(getTrendDirection(110, 100)).toBe('up'); // 10% increase
      expect(getTrendDirection(90, 100)).toBe('down'); // 10% decrease
      expect(getTrendDirection(102, 100)).toBe('stable'); // 2% change (< 5%)
    });

    test('handles null values', () => {
      expect(getTrendDirection(null, 100)).toBe('stable');
      expect(getTrendDirection(100, null)).toBe('stable');
      expect(getTrendDirection(null, null)).toBe('stable');
    });

    test('considers changes less than 5% as stable', () => {
      expect(getTrendDirection(104, 100)).toBe('stable'); // 4% increase
      expect(getTrendDirection(96, 100)).toBe('stable'); // 4% decrease
      expect(getTrendDirection(105, 100)).toBe('up'); // 5% increase
      expect(getTrendDirection(95, 100)).toBe('down'); // 5% decrease
    });
  });

  describe('validateCICDData', () => {
    test('validates complete CICD data structure', () => {
      expect(validateCICDData(MOCK_CICD_DATA)).toBe(true);
    });

    test('rejects null or undefined data', () => {
      expect(validateCICDData(null)).toBe(false);
      expect(validateCICDData(undefined)).toBe(false);
    });

    test('rejects non-object data', () => {
      expect(validateCICDData('string')).toBe(false);
      expect(validateCICDData(123)).toBe(false);
      expect(validateCICDData([])).toBe(false);
    });

    test('rejects incomplete data structure', () => {
      const incompleteData = {
        slowest_build_repo: {},
        pipeline_success_rate: {}
        // missing other required fields
      };

      expect(validateCICDData(incompleteData)).toBe(false);
    });

    test('validates data with all required fields', () => {
      const validData = {
        slowest_build_repo: {},
        longest_pipeline_repo: {},
        pipeline_success_rate: {},
        build_failure_rate: {},
        stage_breakdown: [],
        stage_causing_most_failures: {}
      };

      expect(validateCICDData(validData)).toBe(true);
    });

    test('rejects data with extra fields but missing required ones', () => {
      const dataWithExtraFields = {
        slowest_build_repo: {},
        extra_field: 'value'
        // missing other required fields
      };

      expect(validateCICDData(dataWithExtraFields)).toBe(false);
    });
  });
});
