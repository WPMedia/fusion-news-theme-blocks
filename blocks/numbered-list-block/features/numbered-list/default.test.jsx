import React from 'react';
import { mount } from 'enzyme';

jest.mock('fusion:properties', () => (jest.fn(() => ({
  fallbackImage: 'placeholder.jpg',
}))));

jest.mock('@wpmedia/engine-theme-sdk', () => ({
  Image: () => <img alt="test" />,
  LazyLoad: ({ children }) => <>{ children }</>,
  isServerSide: () => true,
  ThemeStyle: ({ children }) => <>{ children }</>,
}));
const { default: mockData } = require('./mock-data');

describe('The numbered-list-block', () => {
  describe('render a list of numbered-list-items', () => {
    it('should render null if isServerSide and lazyLoad enabled', () => {
      const listContentConfig = {
        contentConfigValues:
        {
          offset: '0',
          query: 'type:story',
          size: '30',
        },
        contentService: 'story-feed-query',
      };
      const customFields = {
        listContentConfig,
        showHeadline: true,
        showImage: true,
        lazyLoad: true,
      };

      const { default: NumberedList } = require('./default');
      NumberedList.prototype.fetchContent = jest.fn().mockReturnValue({});
      const wrapper = mount(<NumberedList customFields={customFields} arcSite="the-sun" deployment={jest.fn((path) => path)} />);
      expect(wrapper.html()).toBe(null);
    });

    it('should render list item with headline, image and a number', () => {
      const { default: NumberedList } = require('./default');
      const listContentConfig = {
        contentConfigValues:
        {
          offset: '0',
          query: 'type:story',
          size: '30',
        },
        contentService: 'story-feed-query',
      };
      const customFields = {
        listContentConfig,
        showHeadline: true,
        showImage: true,
      };
      NumberedList.prototype.fetchContent = jest.fn().mockReturnValue(mockData);

      const wrapper = mount(<NumberedList
        customFields={customFields}
        arcSite="the-sun"
        deployment={jest.fn((path) => path)}
      />);
      wrapper.setState({ resultList: mockData }, () => {
        wrapper.update();
        expect(wrapper.find('.numbered-list-container').length).toEqual(1);
        expect(wrapper.find('.numbered-list-container').childAt(0).type()).toEqual('div');
        expect(wrapper.find('.numbered-list-container').childAt(0).find('.list-item-number').length).toEqual(1);
        expect(wrapper.find('.numbered-list-container').childAt(0).find('.list-item-number').children()
          .text()).toEqual('1');
        expect(wrapper.find('.numbered-list-container').childAt(0).find('.headline-list-anchor').length).toEqual(1);
        expect(wrapper.find('.numbered-list-container').childAt(0).find('.headline-list-anchor').find('.headline-text')).toHaveLength(1);
        expect(wrapper.find('.numbered-list-container').childAt(0).find('.list-anchor-image').length).toEqual(1);
        expect(wrapper.find('.numbered-list-container').childAt(0).find('.list-anchor-image').find('Image').length)
          .toEqual(1);
        expect(wrapper.find('.numbered-list-container').childAt(0).find('.list-anchor-image').find('Image'))
          .toHaveProp('url', 'https://arc-anglerfish-arc2-prod-corecomponents.s3.amazonaws.com/public/K6FTNMOXBBDS5HHTYTAV7LNEF4.jpg');
        expect(wrapper.find('.numbered-list-container').childAt(0).find('.headline-list-anchor').find('.headline-text')
          .children()
          .text()).toEqual('Article with only promo_items.basic');
      });
    });

    it('should render a place holder image', () => {
      const { default: NumberedList } = require('./default');
      const listContentConfig = {
        contentConfigValues:
        {
          offset: '0',
          query: 'type:story',
          size: '30',
        },
        contentService: 'story-feed-query',
      };
      const customFields = {
        listContentConfig,
        showHeadline: true,
        showImage: true,
      };
      NumberedList.prototype.fetchContent = jest.fn().mockReturnValue(mockData);

      const wrapper = mount(<NumberedList
        customFields={customFields}
        arcSite="the-sun"
        deployment={jest.fn((path) => path)}
      />);
      wrapper.setState({ resultList: mockData }, () => {
        wrapper.update();
        expect(wrapper.find('.numbered-list-container').length).toEqual(1);
        expect(wrapper.find('.numbered-list-container').childAt(4).type()).toEqual('div');
        expect(wrapper.find('.numbered-list-container').childAt(4).find('.list-anchor-image').length).toEqual(1);
        const placeholderImage = wrapper.find('.numbered-list-container').childAt(4).find('.list-anchor-image').children();
        // the placeholder component is mocked globally in jest mocks with this alt tag
        expect(placeholderImage.html()).toEqual('<img alt="test">');
        expect(wrapper.find('.numbered-list-container').childAt(6).find('.headline-list-anchor').find('.headline-text')
          .children()
          .text()).toEqual('Story with video as the Lead Art');
      });
    });

    it('should render elements only for arcSite', () => {
      const { default: NumberedList } = require('./default');
      const listContentConfig = {
        contentConfigValues:
        {
          offset: '0',
          query: 'type:story',
          size: '30',
        },
        contentService: 'story-feed-query',
      };
      const customFields = {
        listContentConfig,
        showHeadline: true,
        showImage: true,
      };
      NumberedList.prototype.fetchContent = jest.fn().mockReturnValue(mockData);

      const wrapper = mount(<NumberedList
        customFields={customFields}
        arcSite="dagen"
        deployment={jest.fn((path) => path)}
      />);
      wrapper.setState({ resultList: mockData }, () => {
        wrapper.update();
        expect(wrapper.find('.numbered-list-container').length).toEqual(1);
        expect(wrapper.find('.numbered-list-item').length).toEqual(1);
      });
    });
  });
});
