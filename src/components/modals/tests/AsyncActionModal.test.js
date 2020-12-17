import React from 'react';
import { shallow } from 'enzyme';
import AsyncActionModal from '../AsyncActionModal';
jest.mock('src/context/HibanaContext', () => ({
  useHibana: jest.fn().mockReturnValue([{ isHibanaEnabled: true }]),
}));

describe('Component: AsyncActionModal', () => {
  let onCancelMock;
  let onActionMock;

  beforeEach(() => {
    onCancelMock = jest.fn();
    onActionMock = jest.fn();
  });

  it('should render correctly with open, content, title and custom verb', () => {
    const wrapper = shallow(
      <AsyncActionModal
        open={true}
        onCancel={onCancelMock}
        onAction={onActionMock}
        title="Confirmation Modal Test Title"
        actionVerb="DESTROY"
      >
        <p>Some JSX content for the modal</p>
      </AsyncActionModal>,
    );
    expect(wrapper).toHaveTextContent('Confirmation Modal Test Title');
    expect(wrapper.find('p')).toHaveTextContent('Some JSX content for the modal');
    expect(
      wrapper
        .find('Button')
        .at(0)
        .prop('children'),
    ).toEqual('DESTROY');
  });

  it('should cancel', () => {
    const wrapper = shallow(
      <AsyncActionModal
        onCancel={onCancelMock}
        onAction={onActionMock}
        title="Confirmation Modal Test Title"
        actionVerb="DESTROY"
      >
        <p>Some JSX content for the modal</p>
      </AsyncActionModal>,
    );
    wrapper
      .find('Button')
      .at(1)
      .simulate('click');
    expect(onCancelMock).toHaveBeenCalledTimes(1);
    expect(onActionMock).not.toHaveBeenCalled();
  });

  it('should action', () => {
    const wrapper = shallow(
      <AsyncActionModal
        onCancel={onCancelMock}
        onAction={onActionMock}
        title="Confirmation Modal Test Title"
        actionVerb="DESTROY"
      >
        <p>Some JSX content for the modal</p>
      </AsyncActionModal>,
    );
    wrapper
      .find('Button')
      .at(0)
      .simulate('click');
    expect(onActionMock).toHaveBeenCalledTimes(1);
    expect(onCancelMock).not.toHaveBeenCalled();
  });

  it('should disable action button', () => {
    const wrapper = shallow(
      <AsyncActionModal actioning={true} onCancel={onCancelMock} onAction={onActionMock} />,
    );
    expect(wrapper.find('Button').at(0)).toHaveProp('disabled');
  });

  it('should allow overriding action verb', () => {
    const text = 'I am sure about it';
    const wrapper = shallow(
      <AsyncActionModal actionVerb={text} onCancel={onCancelMock} onAction={onActionMock} />,
    );
    expect(
      wrapper
        .find('Button')
        .at(0)
        .prop('children'),
    ).toEqual(text);
  });

  it('should allow overriding cancel verb', () => {
    const text = 'Do not Cancel';
    const wrapper = shallow(
      <AsyncActionModal cancelVerb={text} onCancel={onCancelMock} onAction={onActionMock} />,
    );
    expect(
      wrapper
        .find('Button')
        .at(1)
        .prop('children'),
    ).toEqual(text);
  });
});
