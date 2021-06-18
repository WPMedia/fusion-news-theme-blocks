import React from 'react';
import { mount } from 'enzyme';
import ExtraLargeManualPromo from './default';

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

describe('the extra large promo feature', () => {
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
    const wrapper = mount(<ExtraLargeManualPromo customFields={updatedConfig} />);
    expect(wrapper.html()).toBe(null);
  });

  it('should have 1 container fluid class', () => {
    const wrapper = mount(<ExtraLargeManualPromo customFields={config} />);
    expect(wrapper.find('.container-fluid')).toHaveLength(1);
  });

  it('should have two link elements by default', () => {
    const wrapper = mount(<ExtraLargeManualPromo customFields={config} />);
    expect(wrapper.find('a')).toHaveLength(2);
  });

  it('should have one img when show image is true with 4:3 default ratio', () => {
    const wrapper = mount(<ExtraLargeManualPromo customFields={config} />);
    expect(wrapper.find('Image')).toHaveLength(1);
    expect(wrapper.find('Image').prop('largeHeight')).toBe(600);
  });

  it('should accept a 16:9 image ratio', () => {
    const myConfig = { ...config, imageRatio: '16:9' };
    const wrapper = mount(<ExtraLargeManualPromo customFields={myConfig} />);
    expect(wrapper.find('Image')).toHaveLength(1);
    expect(wrapper.find('Image').prop('largeHeight')).toBe(450);
  });

  it('should accept a 3:2 image ratio', () => {
    const myConfig = { ...config, imageRatio: '3:2' };
    const wrapper = mount(<ExtraLargeManualPromo customFields={myConfig} />);
    expect(wrapper.find('Image')).toHaveLength(1);
    expect(wrapper.find('Image').prop('largeHeight')).toBe(533);
  });

  it('should have no Overline when showOverline is false', () => {
    const specialConfig = {
      itemContentConfig: { contentService: 'ans-item', contentConfiguration: {} },
      showHeadline: true,
      showOverline: false,
    };
    const wrapper = mount(<ExtraLargeManualPromo customFields={specialConfig} />);
    expect(wrapper.find('Overline')).toHaveLength(0);
  });

  it('should have no PromoHeadline when showHeadline is false', () => {
    const specialConfig = {
      itemContentConfig: { contentService: 'ans-item', contentConfiguration: {} },
      showOverline: true,
      showHeadline: false,
    };
    const wrapper = mount(<ExtraLargeManualPromo customFields={specialConfig} />);
    expect(wrapper.find('PromoHeadline')).toHaveLength(0);
  });

  it('should have no PromoImage when showImage is false', () => {
    const specialConfig = {
      itemContentConfig: { contentService: 'ans-item', contentConfiguration: {} },
      showHeadline: true,
      showImage: false,
    };
    const wrapper = mount(<ExtraLargeManualPromo customFields={specialConfig} />);
    expect(wrapper.find('PromoImage')).toHaveLength(0);
  });

  it('should have no PromoDescription when showDescription is false', () => {
    const specialConfig = {
      itemContentConfig: { contentService: 'ans-item', contentConfiguration: {} },
      showHeadline: true,
      showDescription: false,
    };
    const wrapper = mount(<ExtraLargeManualPromo customFields={specialConfig} />);
    expect(wrapper.find('PromoDescription')).toHaveLength(0);
  });

  it('should have one line separator', () => {
    const wrapper = mount(<ExtraLargeManualPromo customFields={config} />);
    expect(wrapper.find('hr')).toHaveLength(1);
  });
});
