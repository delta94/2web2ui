import React from 'react';
import { render, screen } from '@testing-library/react';
import TestApp from 'src/__testHelpers__/TestApp';
import CompareByAggregatedMetrics from '../CompareByAggregatedMetrics';
jest.mock('../CompareByAggregatedRow', () => {
  const CompareByAggregatedRow = () => <div>Mocked comparison row.</div>;

  return CompareByAggregatedRow;
});

const defaultProps = {
  date: '01/02/03',
  reportOptions: {
    comparisons: [],
  },
};

const subject = props => {
  return render(
    <TestApp isHibanaEnabled={true}>
      <CompareByAggregatedMetrics {...defaultProps} {...props} />
    </TestApp>,
  );
};

describe('CompareByAggregatedMetrics', () => {
  it('renders with the passed in date', () => {
    subject({ date: '03/04/24' });

    expect(screen.getByText('03/04/24')).toBeInTheDocument();
  });

  it('renders comparison rows based on the passed in `reportOptions.comparisons`', () => {
    subject({ reportOptions: { comparisons: ['1', '2', '3', '4'] } });

    expect(screen.getAllByText('Mocked comparison row.')).toHaveLength(4);
  });

  it('does not crash when `reportOptions.comparisons` is undefined', () => {
    subject({ reportOptions: { comparisons: undefined } });

    expect(screen.getByText('01/02/03')).toBeInTheDocument();
  });
});
