import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import ScheduledReportsModal from '../ScheduledReportsModal';
import TestApp from 'src/__testHelpers__/TestApp';
import { deleteScheduledReport, getScheduledReports } from 'src/actions/reports';
jest.mock('src/actions/reports');
const defaultStore = {
  reports: {
    deleteSchedulePending: false,
    getScheduledReportsStatus: 'idle',
    scheduledReports: [
      {
        report_id: '123',
        schedule_id: '12345',
        name: 'My Scheduled Report',
        recipients: ['sparky@sparkpots.com', 'marketing@sparkpost.com'],
      },
    ],
  },
};

describe('Scheduled Reports Modal', () => {
  getScheduledReports.mockImplementation(() => jest.fn(() => Promise.resolve()));
  deleteScheduledReport.mockImplementation(() => jest.fn(() => Promise.resolve()));
  const mockClose = jest.fn();
  const subject = (props, store = defaultStore) => {
    const defaultProps = {
      report: { id: '123', name: 'My Report' },
      open: true,
      onClose: mockClose,
    };

    return render(
      <TestApp isHibanaEnabled={true} store={store}>
        <ScheduledReportsModal {...defaultProps} {...props} />
      </TestApp>,
    );
  };

  it('renders page correctly', () => {
    subject();
    expect(getScheduledReports).toHaveBeenCalled();
    expect(screen.queryByText('Schedules For Reports')).toBeVisible();
    expect(screen.queryByText('My Report')).toBeVisible();
    expect(screen.queryByText('My Scheduled Report')).toBeVisible();
    expect(screen.queryByText('My Scheduled Report')).toHaveAttribute(
      'href',
      '/signals/schedule/123/12345',
    );
    expect(screen.queryByText('Add Schedule')).toBeVisible();
    //Needed to find the parent <a>
    expect(screen.queryByText('Add Schedule').closest('a')).toHaveAttribute(
      'href',
      '/signals/schedule/123',
    );
    expect(screen.queryByText('Email (2)')).toBeVisible();
  });

  it('renders page correctly when there are no results', () => {
    subject({}, { reports: { getScheduledReportsStatus: 'idle', scheduledReports: [] } });
    expect(screen.queryByText('Schedules For Reports')).toBeVisible();
    expect(screen.queryByText('My Report')).toBeVisible();
    expect(screen.queryByText('No results found.')).toBeVisible();
  });

  it('renders page correctly when results are loading', () => {
    subject({}, { reports: { getScheduledReportsStatus: 'loading' } });
    expect(screen.queryByText('Schedules For Reports')).toBeVisible();
    expect(screen.queryByText('My Report')).toBeVisible();
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('closes the modal if an error has occurred', () => {
    subject({}, { reports: { getScheduledReportsStatus: 'error' } });
    expect(mockClose).toHaveBeenCalled();
  });

  it('handles delete properly', () => {
    subject();
    fireEvent.click(screen.getByRole('button', { name: 'Open Menu' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(
      screen.queryByText('Are you sure you want to delete this scheduled report?'),
    ).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(deleteScheduledReport).toHaveBeenCalledWith('123', '12345');
  });
});
