import React from 'react';
import DoughnutChartWithLegend from '../DoughnutChartWithLegend';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

export default {
  title: 'Components/Charts/DoughnutChartWithLegend',
  component: DoughnutChartWithLegend,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'light' },
  },
};

// Sample data for the stories
const chartColors = ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f'];

const defaultData = {
  labels: ['Developer A', 'Developer B', 'Developer C', 'Developer D', 'Others'],
  datasets: [
    {
      data: [30, 25, 20, 15, 10],
      backgroundColor: chartColors,
      borderColor: '#ffffff',
      borderWidth: 2,
      hoverOffset: 15,
    },
  ],
};

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `${context.label}: ${context.raw} PRs`;
        }
      }
    }
  },
  cutout: '60%',
};

const defaultLegendData = [
  { name: 'Developer A', prs_delivered: 30 },
  { name: 'Developer B', prs_delivered: 25 },
  { name: 'Developer C', prs_delivered: 20 },
  { name: 'Developer D', prs_delivered: 15 },
  { name: 'Others', prs_delivered: 10 },
];

// Base template
const Template = (args) => (
  <div style={{ height: '400px', width: '100%', maxWidth: '600px' }}>
    <DoughnutChartWithLegend {...args} />
  </div>
);

// Default doughnut chart with legend
export const Default = Template.bind({});
Default.args = {
  data: defaultData,
  options: defaultOptions,
  legendData: defaultLegendData,
  colors: chartColors,
};

// Empty state
export const EmptyState = Template.bind({});
EmptyState.args = {
  data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
  options: defaultOptions,
  legendData: [],
  colors: chartColors,
  emptyMessage: 'No contributor data available for this period'
};

// With custom labels showing repositories instead of PRs
export const RepositoryData = Template.bind({});
RepositoryData.args = {
  data: {
    labels: ['Reviewer A', 'Reviewer B', 'Reviewer C', 'Reviewer D', 'Others'],
    datasets: [
      {
        data: [12, 9, 7, 5, 3],
        backgroundColor: chartColors,
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 15,
      },
    ],
  },
  options: {
    ...defaultOptions,
    plugins: {
      ...defaultOptions.plugins,
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw} repos`;
          }
        }
      }
    }
  },
  legendData: [
    { name: 'Reviewer A', unique_repos_reviewed: 12 },
    { name: 'Reviewer B', unique_repos_reviewed: 9 },
    { name: 'Reviewer C', unique_repos_reviewed: 7 },
    { name: 'Reviewer D', unique_repos_reviewed: 5 },
    { name: 'Others', unique_repos_reviewed: 3 },
  ],
  colors: chartColors,
};
