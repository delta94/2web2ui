import React from 'react';
import { shallow } from 'enzyme';
import MessagingUsageChart from '../MessagingUsageChart';

describe('MessagingUsageChart', () => {
  const props = {
    data: [
      {
        date: '2020-08-24',
        usage: 170000,
      },
      {
        date: '2020-08-25',
        usage: 180000,
      },
    ],
    usage: 1000,
    overage: 500,
  };

  it('renders the MessagingUsageChart correctly', () => {
    const instance = shallow(<MessagingUsageChart {...props} />);

    expect(instance).toHaveTextContent('Usage');
  });
});
