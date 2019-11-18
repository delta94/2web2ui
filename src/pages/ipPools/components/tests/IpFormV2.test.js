import React from 'react';
import { shallow } from 'enzyme';
import { IpFormV2 } from '../IpFormV2';

describe('Edit IP form', () => {
  const subject = (props) => {
    const defaultProps = {
      handleSubmit: jest.fn(),
      onSubmit: jest.fn(),
      submit: jest.fn(),
      submitting: false,
      ip: {
        hostname: 'abcd.com'
      },
      pools: [],
      pool: null,
      isAutoWarmupEnabled: true
    };
    const mergedProps = Object.assign({}, defaultProps, props);

    return shallow(<IpFormV2 {...mergedProps}/>);
  };

  it('disables form submission and interaction when submitting', () => {
    const wrapper = subject({ submitting: true });

    expect(wrapper.find('Button')).toHaveProp('disabled', true);
    wrapper.find('Field').forEach((el) => {
      expect(el).toHaveProp('disabled', true);
    });
  });

  it('renders the IP hostname', () => {
    const wrapper = subject({ ip: { hostname: 'my-mock-hostname.com' }});

    expect(wrapper).toHaveTextContent('my-mock-hostname.com');
  });

  it('renders the "Engagement Based IP Warmup" section', () => {
    const wrapper = subject();

    expect(wrapper).toHaveTextContent('Engagement Based IP Warmup');
  });

  it('renders the button content as "Saving" while the form is submitting', () => {
    const wrapper = subject({ submitting: true });

    expect(wrapper).toHaveTextContent('Saving');
  });

  it('renders the button content as "Update Sending IP" while the form is not submitting', () => {
    const wrapper = subject();

    expect(wrapper).toHaveTextContent('Update Sending IP');
  });

  it('submits passed in data when the <form> is submitted', () => {
    const mockHandleSubmit = jest.fn();
    const wrapper = subject({ handleSubmit: mockHandleSubmit });
    const formData = { ip_pool: 'abc', auto_warmup_enabled: true };

    wrapper.find('form').simulate('submit', formData);

    expect(mockHandleSubmit).toHaveBeenCalledWith(formData);
  });

  it('renders "Auto IP Warmup" with "true" checked when auto warmup is enabled', () => {
    const wrapper = subject({ isAutoWarmupEnabled: true });

    expect(wrapper.find('[name="auto_warmup_enabled"]')).toHaveProp('value', 'true');
  });

  it('renders "Auto IP Warmup" with "false" checked when auto warmup is not enabled', () => {
    const wrapper = subject({ isAutoWarmupEnabled: false });

    expect(wrapper.find('[name="auto_warmup_enabled"]')).toHaveProp('value', 'false');
  });

  it('opens the confirmation modal when clicking the "Update Sending IP" button when the state of auto warmup enabling is changed from its initial state', () => {
    let wrapper = subject({ isAutoWarmupEnabled: true, ip: { auto_warmup_enabled: false }});

    wrapper.find('Button').simulate('click');

    expect(wrapper.find('ConfirmationModal')).toHaveProp('open', true);
    expect(wrapper).toHaveTextContent('Are you sure you want to enable Auto IP Warmup?');

    wrapper = subject({ isAutoWarmupEnabled: false, ip: { auto_warmup_enabled: true }});

    wrapper.find('Button').simulate('click');

    expect(wrapper).toHaveTextContent('Are you sure you want to disable Auto IP Warmup?');
    expect(wrapper.find('ConfirmationModal')).toHaveProp('open', true);
  });

  it('does not open the confirmation modal when the state of auto warmup enabling remains unchanged', () => {
    const wrapper = subject({ isAutoWarmupEnabled: true, ip: { auto_warmup_enabled: true }});

    wrapper.find('Button').simulate('click');

    expect(wrapper.find('ConfirmationModal')).toHaveProp('open', false);
  });
});
