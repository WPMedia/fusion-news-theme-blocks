import React from 'react';
import { mount } from 'enzyme';
import { useContent } from 'fusion:content';
import MediumPromo from './default';

const { default: mockData } = require('./mock-data');

jest.mock('@wpmedia/engine-theme-sdk', () => ({
  Image: () => <div />,
  LazyLoad: ({ children }) => <>{ children }</>,
  isServerSide: () => true,
  localizeDateTime: jest.fn(() => new Date().toDateString()),
}));
jest.mock('fusion:themes', () => (jest.fn(() => ({}))));
jest.mock('fusion:properties', () => (jest.fn(() => ({
  fallbackImage: 'placeholder.jpg',
}))));
jest.mock('fusion:context', () => ({
  useFusionContext: jest.fn(() => ({
    arcSite: 'the-sun',
  })),
  useComponentContext: jest.fn(() => ({
    registerSuccessEvent: () => ({}),
  })),
}));
jest.mock('fusion:content', () => ({
  useContent: jest.fn(() => (mockData)),
  useEditableContent: jest.fn(() => ({
    editableContent: () => ({ contentEditable: 'true' }),
    searchableField: () => {},
  })),
}));

const config = {
  itemContentConfig: { contentService: 'ans-item', contentConfiguration: {} },
  showHeadline: true,
  // headlinePosition: 'below',
  showImage: true,
};

describe('the medium promo feature', () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('should return null if lazyLoad on the server and not in the admin', () => {
    const updatedConfig = {
      ...config,
      lazyLoad: true,
    };
    const wrapper = mount(<MediumPromo customFields={updatedConfig} />);
    expect(wrapper.html()).toBe(null);
  });

  it('should have 1 container fluid class', () => {
    const wrapper = mount(<MediumPromo customFields={config} />);
    expect(wrapper.find('.container-fluid')).toHaveLength(1);
  });

  it('should have two link elements by default', () => {
    const wrapper = mount(<MediumPromo customFields={config} />);
    expect(wrapper.find('a')).toHaveLength(2);
  });

  it('should link the headline to the current site website_url ANS property', () => {
    const url = mockData.websites['the-sun'].website_url;
    const wrapper = mount(<MediumPromo customFields={config} />);
    expect(wrapper.find('.md-promo-headline a')).toHaveProp('href', url);
  });

  it('should link the image to the current site website_url ANS property', () => {
    const url = mockData.websites['the-sun'].website_url;
    const wrapper = mount(<MediumPromo customFields={config} />);
    expect(wrapper.find('a').at(1)).toHaveProp('href', url);
  });

  it('should have one img when show image is true', () => {
    const wrapper = mount(<MediumPromo customFields={config} />);
    expect(wrapper.find('Image')).toHaveLength(1);
    expect(wrapper.find('Image').prop('largeHeight')).toBe(225);
  });

  it('should accept a 16:9 image ratio', () => {
    const myConfig = { ...config, imageRatio: '16:9' };
    const wrapper = mount(<MediumPromo customFields={myConfig} />);
    expect(wrapper.find('Image')).toHaveLength(1);
    expect(wrapper.find('Image').prop('largeHeight')).toBe(225);
  });

  it('should accept a 3:2 image ratio', () => {
    const myConfig = { ...config, imageRatio: '3:2' };
    const wrapper = mount(<MediumPromo customFields={myConfig} />);
    expect(wrapper.find('Image')).toHaveLength(1);
    expect(wrapper.find('Image').prop('largeHeight')).toBe(267);
  });

  it('should have class .md-promo-image when show image is true', () => {
    const wrapper = mount(<MediumPromo customFields={config} />);
    expect(wrapper.find('.md-promo-image')).toHaveLength(1);
  });

  it('should have no Image when show image is false', () => {
    const noImgConfig = {
      itemContentConfig: { contentService: 'ans-item', contentConfiguration: {} },
      showHeadline: true,
      // headlinePosition: 'below',
      showImage: false,
    };
    const wrapper = mount(<MediumPromo customFields={noImgConfig} />);
    expect(wrapper.find('Image')).toHaveLength(0);
  });

  it('should not have .md-promo-image class when show image is false', () => {
    const noImgConfig = {
      itemContentConfig: { contentService: 'ans-item', contentConfiguration: {} },
      showHeadline: true,
      showImage: false,
    };
    const wrapper = mount(<MediumPromo customFields={noImgConfig} />);
    expect(wrapper.find('.md-promo-image')).toHaveLength(0);
  });

  it('should only be one link when showHeadline is false and show image is true', () => {
    const noHeadlineConfig = {
      itemContentConfig: { contentService: 'ans-item', contentConfiguration: {} },
      showHeadline: false,
      showImage: true,
    };
    const wrapper = mount(<MediumPromo customFields={noHeadlineConfig} />);
    expect(wrapper.find('a')).toHaveLength(1);
  });

  it('should have by default an 16:9 image ratio', () => {
    const wrapper = mount(<MediumPromo customFields={config} />);
    const img = wrapper.find('Image');
    expect(img.prop('largeHeight')).toBe(225);
  });

  it('should accept a 16:9 ratio', () => {
    const myConfig = { ...config, imageRatio: '16:9' };
    const wrapper = mount(<MediumPromo customFields={myConfig} />);
    const img = wrapper.find('Image');
    expect(img.prop('largeHeight')).toBe(225);
  });

  it('should accept a 3:2 ratio', () => {
    const myConfig = { ...config, imageRatio: '3:2' };
    const wrapper = mount(<MediumPromo customFields={myConfig} />);
    const img = wrapper.find('Image');
    expect(img.prop('largeHeight')).toBe(267);
  });

  it('should accept a 4:3 ratio', () => {
    const myConfig = { ...config, imageRatio: '4:3' };
    const wrapper = mount(<MediumPromo customFields={myConfig} />);
    const img = wrapper.find('Image');
    expect(img.prop('largeHeight')).toBe(300);
  });

  it('returns null if null content', () => {
    const myConfig = {
      showHeadline: true,
      showImage: true,
      imageRatio: '4:3',
      imageOverrideURL: 'overrideImage.jpg',
    };

    useContent.mockReturnValueOnce(undefined);
    const wrapper = mount(<MediumPromo customFields={myConfig} arcSite="dagen" />);
    expect(wrapper).toEqual({});
    wrapper.unmount();
  });

  it('no image is shown if resizer returns no resized image options', () => {
    const myConfig = {
      showHeadline: true,
      showImage: true,
      imageRatio: '4:3',
      imageOverrideURL: 'overrideImage.jpg',
    };

    useContent.mockReturnValueOnce({}).mockReturnValueOnce(null);

    const wrapper = mount(<MediumPromo customFields={myConfig} arcSite="dagen" />);

    const image = wrapper.find('Image');
    expect(image.length).toBe(0);
    wrapper.unmount();
  });

  it('show ALL options if enabled', () => {
    useContent.mockReturnValueOnce(mockData);

    const myConfig = {
      showHeadline: true,
      showImage: true,
      imageRatio: '4:3',
      showDescription: true,
      showByline: true,
      showDate: true,
    };

    const wrapper = mount(<MediumPromo customFields={myConfig} />);

    expect(wrapper.find('.md-promo-headline').length).toBe(2);
    expect(wrapper.find('.description-text').length).toBe(5);
    expect(wrapper.find('Byline').length).toBe(1);
    expect(wrapper.find('PromoDate').length).toBe(1);
    expect(wrapper.find('Image').length).toBe(1);
    wrapper.unmount();
  });

  it('shows placeholder image if no image URL', () => {
    useContent.mockReturnValueOnce({});

    const myConfig = {
      showHeadline: true,
      showImage: true,
      imageRatio: '4:3',
    };

    const wrapper = mount(<MediumPromo customFields={myConfig} />);

    expect(wrapper.find('PlaceholderImage').length).toBe(1);
    expect(wrapper.find('Image').length).toBe(0);
    wrapper.unmount();
  });
});
