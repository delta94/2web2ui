import React from 'react';
import { shallow } from 'enzyme';
import RVUsageChart, { CustomTooltip } from '../RVUsageChart';

describe('RVUsageChart', () => {
  const defaultProps = {
    data: [
      {
        date: '2020-08-15',
        usage: 1234,
      },
      {
        date: '2020-08-16',
        usage: 5678,
      },
    ],
  };

  it('renders a chart element correctly', () => {
    const instance = shallow(<RVUsageChart {...defaultProps} />);
    // Checks y axis label rendered
    expect(instance).toHaveTextContent('Validations');
  });

  it('renders a custom tooltip correctly', () => {
    const instance = shallow(<CustomTooltip payload={[{ value: 1234 }]} label="2020-08-15" />);
    expect(instance).toHaveTextContent('August 15th');
    expect(instance).toHaveTextContent('Validations');
    expect(instance).toHaveTextContent('1.23K');
    expect(instance).toHaveTextContent('Expenses');
  });
});
