import React from 'react';
import { render } from '@testing-library/react';
import { BounceReasonTab } from '../BounceReasonTab';
import TestApp from 'src/__testHelpers__/TestApp';
import { useReportBuilderContext } from 'src/pages/reportBuilder/context/ReportBuilderContext';
jest.mock('src/pages/reportBuilder/context/ReportBuilderContext');
useReportBuilderContext.mockImplementation(() => ({
  state: {
    relativeRange: 'hour',
    from: 'randomDate',
    to: 'randomDate',
  },
}));

describe('BounceReasonTab', () => {
  const mockGetData = jest.fn();
  const defaultProps = {
    loading: false,
    aggregates: {
      countBounce: 10,
      countSent: 100,
    },
    reportOptions: {
      relativeRange: 'hour',
      from: 'randomDate',
      to: 'randomDate',
    },
    refreshBounceReport: mockGetData,
    reasons: [
      {
        bounce_category_name: 'Block',
        bounce_class_description:
          'The message was blocked by the receiver as coming from a known spam source',
        bounce_class_name: 'Spam Block',
        classification_id: 51,
        count_bounce: 5,
        domain: 'yahoo.com',
        reason: 'Because I said so',
      },
    ],
    bounceSearchOptions: {},
  };
  const subject = props =>
    render(
      <TestApp>
        <BounceReasonTab {...defaultProps} {...props} />
      </TestApp>,
    );
  it('renders with the correct row information', () => {
    const { queryByText } = subject();

    expect(queryByText('50%')).toBeInTheDocument();
    expect(queryByText('Spam Block')).toBeInTheDocument();
    expect(queryByText('Block')).toBeInTheDocument();
    expect(queryByText('Because I said so')).toBeInTheDocument();
    expect(queryByText('yahoo.com')).toBeInTheDocument();
  });

  it('does not make api request when report options is not valid', () => {
    useReportBuilderContext.mockImplementationOnce(() => ({
      state: {
        relativeRange: 'hour',
      },
    }));
    subject();
    expect(mockGetData).not.toHaveBeenCalled();
  });

  it('shows empty message when there is no data', () => {
    const { queryByText } = subject({ reasons: [] });

    expect(queryByText('No bounce reasons to report')).toBeInTheDocument();
  });
});
