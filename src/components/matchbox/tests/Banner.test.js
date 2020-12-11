import React from 'react';
import { shallow } from 'enzyme';
import { useHibana } from 'src/context/HibanaContext';
import Banner from '../Banner.js';

jest.mock('src/context/HibanaContext');

describe('Banner', () => {
  it('should only render hibana component when hibana is enabled', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);

    const wrapper = shallow(<Banner />);

    expect(wrapper).toHaveDisplayName('HibanaBanner');
  });

  it('should only render matchbox component when hibana is not enabled', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);

    const wrapper = shallow(<Banner />);

    expect(wrapper).toHaveDisplayName('OGBanner');
  });

  describe('Banner.Action', () => {
    const subject = () => shallow(<Banner.Action />);

    it('renders when Hibana is enabled', () => {
      useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);
      const wrapper = subject();

      expect(wrapper).toExist();
    });

    it('throws an error when Hibana is not enabled', () => {
      useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);

      expect(subject).toThrowError();
    });
  });
  describe('Banner.Media', () => {
    const subject = () => shallow(<Banner.Media />);

    it('renders when Hibana is enabled', () => {
      useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);
      const wrapper = subject();

      expect(wrapper).toExist();
    });

    it('throws an error when Hibana is not enabled', () => {
      useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);

      expect(subject).toThrowError();
    });
  });
});
