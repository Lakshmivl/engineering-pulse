import React from 'react';
import MetricCard from '../MetricCard';
import { TotalPRsIcon, PRsMergedIcon, CycleTimeIcon } from '../../shared/icons/MetricIcons';

export default {
  title: 'Components/Dashboard/MetricCard',
  component: MetricCard,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    value: { control: 'text' },
    icon: { control: 'object' }
  },
};

// Template for the component
const Template = (args) => <MetricCard {...args} />;

// Default metric card
export const Default = Template.bind({});
Default.args = {
  title: 'Total PRs',
  value: 157,
  icon: <TotalPRsIcon />
};

// Merged PRs metric
export const MergedPRs = Template.bind({});
MergedPRs.args = {
  title: 'PRs Merged',
  value: 142,
  icon: <PRsMergedIcon />
};

// Cycle Time metric
export const CycleTime = Template.bind({});
CycleTime.args = {
  title: 'Avg Cycle Time',
  value: '1.2 days',
  icon: <CycleTimeIcon />
};

// Metric without icon
export const NoIcon = Template.bind({});
NoIcon.args = {
  title: 'Custom Metric',
  value: '95%',
  icon: null
};
