import React from 'react';
import { shallow } from 'enzyme';
import Overline from './index';

const mockContextObj = {
  arcSite: 'site',
};

jest.mock('@wpmedia/engine-theme-sdk', () => ({
  formatURL: jest.fn((input) => (input.toString())),
  Overline: () => <div />,
}));

jest.mock('fusion:properties', () => (jest.fn(() => ({}))));
jest.mock('fusion:context', () => ({
  useFusionContext: jest.fn(() => mockContextObj),
}));

jest.mock('fusion:intl', () => ({
  __esModule: true,
  default: jest.fn((locale) => ({ t: jest.fn((phrase) => require('../../intl.json')[phrase][locale]) })),
}));

describe('Overline block', () => {
  it('should return an Overline element', () => {
    const wrapper = shallow(<Overline />);
    expect(wrapper.find('Overline').length).toEqual(1);
  });
});
