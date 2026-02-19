import {
  transformForQEMetricCards,
  transformForSprintTestAutomationResults,
  validateQEData
} from './qeDataTransformers';
import { mockQEData, mockEmptyQEData } from '../__mocks__/mockQEData';

describe('QE Data Transformers', () => {
  describe('transformForQEMetricCards', () => {
    test('transforms QE data correctly for metric cards', () => {
      const result = transformForQEMetricCards(mockQEData);
      
      expect(result).toHaveProperty('highestFailures');
      expect(result).toHaveProperty('longestAutomation');
      expect(result).toHaveProperty('automationCoverage');
      expect(result).toHaveProperty('flakyRuns');
      
      // Check automation coverage
      expect(result.automationCoverage.title).toBe('Automation Coverage');
      expect(result.automationCoverage.value).toBe('4.88%');
      expect(result.automationCoverage.subtitle).toBe('% of merged PRs that had automation');
      expect(result.automationCoverage.trend).toBe('positive');
      
      // Check flaky runs
      expect(result.flakyRuns.title).toBe('Flaky Runs');
      expect(result.flakyRuns.value).toBe('0%');
      expect(result.flakyRuns.subtitle).toBe('PRs where automation failed first, passed on retry');
      expect(result.flakyRuns.trend).toBe('negative');
    });

    test('returns null for invalid data', () => {
      expect(transformForQEMetricCards(null)).toBeNull();
      expect(transformForQEMetricCards(undefined)).toBeNull();
    });

    test('handles missing fields gracefully', () => {
      const incompleteData = {
        qe_automation_coverage_percentage: 5.0,
        // missing flaky_automation_percentage
      };
      
      const result = transformForQEMetricCards(incompleteData);
      expect(result.automationCoverage.value).toBe('5%');
      expect(result.flakyRuns.value).toBe('0%'); // should default to 0
    });
  });

  describe('transformForSprintTestAutomationResults', () => {
    test('transforms repo run summary correctly', () => {
      const result = transformForSprintTestAutomationResults(mockQEData.repo_run_summary);
      
      expect(result).toHaveProperty('labels');
      expect(result).toHaveProperty('datasets');
      expect(result.datasets).toHaveLength(3); // Passed, Failed, Avg Duration
      
      // Check labels
      expect(result.labels).toEqual(['IT-WEB-AEM-WEBSITE', 'IT-WEB-SERVICES', 'IT-WEB-CART-CHECKOUT']);
      
      // Check datasets
      const passedDataset = result.datasets.find(d => d.label === 'Passed');
      const failedDataset = result.datasets.find(d => d.label === 'Failed');
      const durationDataset = result.datasets.find(d => d.label === 'Avg Duration');
      
      expect(passedDataset.data).toEqual([15, 2, 5]); // total_runs - failure_count
      expect(failedDataset.data).toEqual([8, 0, 1]);
      expect(durationDataset.data).toEqual([7.3, 2.8, 22.7]); // rounded to 1 decimal
    });

    test('returns null for invalid data', () => {
      expect(transformForSprintTestAutomationResults(null)).toBeNull();
      expect(transformForSprintTestAutomationResults(undefined)).toBeNull();
    });

    test('handles empty array', () => {
      const result = transformForSprintTestAutomationResults([]);
      expect(result).toBeNull();
    });
  });

  describe('validateQEData', () => {
    test('validates complete QE data structure', () => {
      expect(validateQEData(mockQEData)).toBe(true);
    });

    test('rejects incomplete data', () => {
      expect(validateQEData(mockEmptyQEData)).toBe(true); // empty but has all fields
      expect(validateQEData(null)).toBe(false);
      expect(validateQEData(undefined)).toBe(false);
      expect(validateQEData({})).toBe(false);
    });

    test('rejects data missing required fields', () => {
      const incompleteData = {
        repo_with_highest_automation_failures: {},
        // missing other required fields
      };
      
      expect(validateQEData(incompleteData)).toBe(false);
    });

    test('validates all new required fields', () => {
      const dataWithNewFields = {
        ...mockQEData,
        qe_automation_coverage_percentage: 4.88,
        flaky_automation_percentage: 0,
        repo_run_summary: []
      };
      
      expect(validateQEData(dataWithNewFields)).toBe(true);
    });
  });
});
