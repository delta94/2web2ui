import { shallow } from 'enzyme';
import React from 'react';
import CreditCardSection from '../CreditCardSection';
// jest.mock('src/constants', () => ({
//   FORMS: {
//     JOIN_PLAN: 'test'
//   }
// }));

describe('creditCardSection', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      billing: {
        countries: []
      },
      submitting: false,
      selectedPlan: {}
    };
    wrapper = shallow(<CreditCardSection {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });


  it('should render correctly when selectedPlan is Free', () => {
    props.selectedPlan = {
      isFree: true
    };
    wrapper.setProps(props);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when form is being submitted', () => {
    props.submitting = true;
    wrapper.setProps(props);
    expect(wrapper).toMatchSnapshot();
  });


});

