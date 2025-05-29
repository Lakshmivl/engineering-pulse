import React from 'react';
import Header from '../Header';

export default {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    startDate: { control: 'date' },
    endDate: { control: 'date' },
    onDateChange: { action: 'date changed' },
    onRefresh: { action: 'refresh clicked' }
  },
};

// Create a template for the component
const Template = (args) => <Header {...args} />;

// Create a primary story with default props
export const Default = Template.bind({});
Default.args = {
  startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
  endDate: new Date(),
};

// Create a story with custom date range
export const CustomDateRange = Template.bind({});
CustomDateRange.args = {
  startDate: new Date(2023, 0, 1), // January 1, 2023
  endDate: new Date(2023, 2, 31), // March 31, 2023
};
