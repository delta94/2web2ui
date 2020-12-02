import React from 'react';
import { render, screen } from '@testing-library/react';
import { ReportsListModal } from '../ReportsListModal';
import TestApp from 'src/__testHelpers__/TestApp';

describe('ReportsListModal', () => {
  const defaults = {
    currentUser: 'Sparky McSparkFace',
    handleDelete: jest.fn(),
    handleEdit: jest.fn(),
    open: true,
    reports: [
      {
        id: 0,
        creator: 'Sparky McSparkFace',
        name: 'My Saved Report',
        modified: '2020-09-02T13:00:00.000Z',
        current_user_can_edit: true,
      },
      {
        id: 1,
        creator: 'Not Me',
        name: 'Someone Elses Report',
        modified: '2020-10-02T13:00:00.000Z',
        current_user_can_edit: false,
      },
    ],
  };

  const subject = props => {
    render(
      <TestApp isHibanaEnabled={true}>
        <ReportsListModal {...defaults} {...props} />
      </TestApp>,
    );
  };

  it('renders modal correctly', () => {
    subject();
    const testFirstTab = texts => {
      texts.forEach(text => {
        expect(screen.getByText(text)).toBeVisible();
      });
    };
    const testSecondTab = texts => {
      texts.forEach(text => {
        expect(screen.getByText(text)).toBeVisible();
      });
    };

    expect(screen.getByText('My Reports')).toBeVisible();
    expect(screen.getByText('All Reports')).toBeVisible();
    testFirstTab(['Name', 'Last Modification', 'My Saved Report', /Sep [123] 2020/]);
    expect(screen.queryByText('Someone Elses Report')).not.toBeInTheDocument();

    screen.getByText('All Reports').click();
    testSecondTab(['Name', 'Last Modification', 'My Saved Report', /Sep [123] 2020/]);
    expect(screen.getByText('Created By')).toBeVisible();
    expect(screen.getByText('Sparky McSparkFace')).toBeVisible();
  });

  it('does not render action list for not editable reports', () => {
    subject();
    screen.getByText('All Reports').click();
    expect(screen.queryByTestId('popover-allreports-0')).toBeInTheDocument();
    expect(screen.queryByTestId('popover-allreports-1')).not.toBeInTheDocument();
  });

  it('handles delete when clicking delete in the actionlist', () => {
    subject();
    screen.getByText('All Reports').click();
    screen.getByTestId('popover-allreports-0').click();
    screen.getByText('Delete').click();
    expect(defaults.handleDelete).toHaveBeenCalledWith(
      expect.objectContaining({ id: 0, name: 'My Saved Report' }),
    );
  });

  it('handles edit when clicking edit in the actionlist', () => {
    subject();
    screen.getByText('All Reports').click();
    screen.getByTestId('popover-allreports-0').click();
    screen.getByText('Edit').click();
    expect(defaults.handleEdit).toHaveBeenCalledWith(
      expect.objectContaining({ id: 0, name: 'My Saved Report' }),
    );
  });
});
