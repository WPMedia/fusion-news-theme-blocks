import React from 'react';
import { mount } from 'enzyme';
import LargeManualPromo from './default';

jest.mock('@wpmedia/engine-theme-sdk', () => ({
  Image: () => <div />,
  LazyLoad: ({ children }) => <>{ children }</>,
  isServerSide: () => true,
  formatURL: jest.fn((input) => input.toString()),
  Overline: () => <div />,
}));
jest.mock('fusion:themes', () => (jest.fn(() => ({}))));
jest.mock('fusion:properties', () => (jest.fn(() => ({}))));
jest.mock('fusion:properties', () => (jest.fn(() => ({}))));
jest.mock('fusion:context', () => ({
  useFusionContext: jest.fn(() => ({})),
  useComponentContext: jest.fn(() => ({
    registerSuccessEvent: () => ({}),
  })),
}));

jest.mock('fusion:content', () => ({
  useContent: jest.fn(() => ({})),
  useEditableContent: jest.fn(() => ({
    searchableField: () => {},
  })),
}));

const config = {
  showOverline: true,
  showHeadline: true,
  showImage: true,
  showDescription: true,
  headline: 'This is the headline',
  description: 'This is the description',
  overline: 'overline',
  overlineURL: 'www.google.com',
  imageURL: 'www.google.com/fake.png',
  linkURL: 'www.google.com',
};

describe('the large promo feature', () => {
  afterEach(() => {
    jest.resetModules();
  });

  beforeEach(() => {
    jest.mock('fusion:context', () => ({
      useFusionContext: jest.fn(() => ({
        arcSite: 'the-sun',
        id: 'testId',
      })),
    }));
  });

  it('should return null if lazyLoad on the server and not in the admin', () => {
    const updatedConfig = {
      ...config,
      lazyLoad: true,
    };
    const wrapper = mount(<LargeManualPromo customFields={updatedConfig} />);
    expect(wrapper.html()).toBe(null);
  });

  it('should have 1 container fluid class', () => {
    const wrapper = mount(<LargeManualPromo customFields={config} />);
    expect(wrapper.find('.container-fluid')).toHaveLength(1);
  });

  it('should have two link elements by default', () => {
    const wrapper = mount(<LargeManualPromo customFields={config} />);
    expect(wrapper.find('a')).toHaveLength(2);
  });

  it('should have one img when show image is true with 4:3 default ratio', () => {
    const wrapper = mount(<LargeManualPromo customFields={config} />);
    expect(wrapper.find('Image')).toHaveLength(1);
    expect(wrapper.find('Image').prop('largeHeight')).toBe(283);
  });

  it('should accept a 16:9 image ratio', () => {
    const myConfig = { ...config, imageRatio: '16:9' };
    const wrapper = mount(<LargeManualPromo customFields={myConfig} />);
    expect(wrapper.find('Image')).toHaveLength(1);
    expect(wrapper.find('Image').prop('largeHeight')).toBe(212);
  });

  it('should accept a 3:2 image ratio', () => {
    const myConfig = { ...config, imageRatio: '3:2' };
    const wrapper = mount(<LargeManualPromo customFields={myConfig} />);
    expect(wrapper.find('Image')).toHaveLength(1);
    expect(wrapper.find('Image').prop('largeHeight')).toBe(251);
  });

  it('Headline div should have class .col-md-xl-6 when show image is true', () => {
    const wrapper = mount(<LargeManualPromo customFields={config} />);
    expect(wrapper.find('.col-md-xl-6')).toHaveLength(2);
  });

  it('should have no Image when show image is false', () => {
    const noImgConfig = {
      showOverline: true,
      showHeadline: true,
      showImage: false,
      showDescription: true,
      headline: 'This is the headline',
      description: 'This is the description',
      overline: 'overline',
      overlineURL: 'www.google.com',
      imageURL: 'www.google.com/fake.png',
      linkURL: 'www.google.com',
    };
    const wrapper = mount(<LargeManualPromo customFields={noImgConfig} />);
    expect(wrapper.find('Image')).toHaveLength(0);
  });

  it('headline div should have class .col-sm-xl-12 when show image is false', () => {
    const noImgConfig = {
      showOverline: true,
      showHeadline: true,
      showImage: false,
      showDescription: true,
      headline: 'This is the headline',
      description: 'This is the description',
      overline: 'overline',
      overlineURL: 'www.google.com',
      imageURL: 'www.google.com/fake.png',
      linkURL: 'www.google.com',
    };
    const wrapper = mount(<LargeManualPromo customFields={noImgConfig} />);
    expect(wrapper.find('.col-sm-xl-12')).toHaveLength(1);
  });

  it('should only be one link when showOverline and showHeadline is false and show image is true', () => {
    const noHeadlineConfig = {
      showOverline: false,
      showHeadline: false,
      showImage: true,
      showDescription: true,
      headline: 'This is the headline',
      description: 'This is the description',
      overline: 'overline',
      overlineURL: 'www.google.com',
      imageURL: 'www.google.com/fake.png',
      linkURL: 'www.google.com',
    };
    const wrapper = mount(<LargeManualPromo customFields={noHeadlineConfig} />);
    expect(wrapper.find('a')).toHaveLength(1);
  });

  it('should have one line separator', () => {
    const wrapper = mount(<LargeManualPromo customFields={config} />);
    expect(wrapper.find('hr')).toHaveLength(1);
  });
});
