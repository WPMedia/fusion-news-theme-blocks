import React from 'react';
import { mount } from 'enzyme';
import getThemeStyle from 'fusion:themes';
import mockData,
{
  oneListItem,
  withoutByline,
  oneListItemWithoutSectionName,
} from './mock-data';

const mockReturnData = mockData;

jest.mock('fusion:themes', () => jest.fn(() => ({})));

jest.mock('fusion:properties', () => (jest.fn(() => ({
  fallbackImage: 'placeholder.jpg',
}))));

jest.mock('@wpmedia/engine-theme-sdk', () => ({
  Image: () => <div />,
  LazyLoad: ({ children }) => <>{ children }</>,
  isServerSide: () => true,
  Overline: () => <div />,
}));

jest.mock('@wpmedia/date-block', () => ({
  __esModule: true,
  default: function ArticleDate() { return <div />; },
}));

jest.mock('@wpmedia/shared-styles', () => ({
  __esModule: true,
  Byline: () => <div />,
  Overline: () => <div />,
  PrimaryFont: (props) => <div {...props} />,
}));

describe('Card list', () => {
  it('should render null if isServerSide and lazyLoad enabled', () => {
    const listContentConfig = {
      contentConfigValues: {
        offset: '0',
        query: 'type:story',
        size: '30',
      },
      contentService: 'story-feed-query',
    };
    const customFields = {
      listContentConfig,
      lazyLoad: true,
    };

    const { default: CardList } = require('./default');
    CardList.prototype.fetchContent = jest.fn().mockReturnValue(mockReturnData);
    const wrapper = mount(<CardList customFields={customFields} arcSite="the-sun" deployment={jest.fn((path) => path)} />);
    expect(wrapper.html()).toBe(null);
  });

  it('should render a list of stories', () => {
    const listContentConfig = {
      contentConfigValues: {
        offset: '0',
        query: 'type:story',
        size: '30',
      },
      contentService: 'story-feed-query',
    };
    const customFields = { listContentConfig };

    const { default: CardList } = require('./default');
    CardList.prototype.fetchContent = jest.fn().mockReturnValue(mockReturnData);
    const wrapper = mount(<CardList customFields={customFields} arcSite="the-sun" deployment={jest.fn((path) => path)} />);
    wrapper.setState({ cardList: mockData }, () => {
      wrapper.update();
      expect(wrapper.find('.card-list-container').length).toEqual(1);
      expect(wrapper.find('article.card-list-item').length).toEqual(27);
      expect(wrapper.find('.simple-results-list-container').childAt(0).hasClass('list-item-simple')).toEqual(true);
    });
  });

  it('should render a list of stories only for the arcSite', () => {
    const listContentConfig = {
      contentConfigValues: {
        offset: '0',
        query: 'type:story',
        size: '30',
      },
      contentService: 'story-feed-query',
    };
    const customFields = { listContentConfig };

    const { default: CardList } = require('./default');
    CardList.prototype.fetchContent = jest.fn().mockReturnValue(mockReturnData);
    const wrapper = mount(<CardList customFields={customFields} arcSite="dagen" deployment={jest.fn((path) => path)} />);
    wrapper.setState({ cardList: mockData }, () => {
      wrapper.update();
      expect(wrapper.find('.card-list-container').length).toEqual(1);
      expect(wrapper.find('article.card-list-item').length).toEqual(0);
      expect(wrapper.find('article.list-item-simple').length).toEqual(1);
      expect(wrapper.find('.simple-results-list-container').childAt(0).hasClass('list-item-simple')).toEqual(true);
    });
  });

  describe('renders the main list item correctly', () => {
    const listContentConfig = {
      contentConfigValues: {
        offset: '0',
        query: 'type:story',
        size: '1',
      },
      contentService: 'story-feed-query',
    };
    const title = 'Test Title';
    const customFields = { listContentConfig, title };
    const { default: CardList } = require('./default');
    getThemeStyle.mockImplementation(() => ({ 'primary-font-family': 'Papyrus' }));
    CardList.prototype.fetchContent = jest.fn().mockReturnValue(oneListItem);
    const wrapper = mount(<CardList customFields={customFields} arcSite="the-sun" deployment={jest.fn((path) => path)} />);

    wrapper.setState({ cardList: oneListItem }, () => {
      it('should have one parent wrapper', () => {
        expect(wrapper.find('.card-list-container').length).toEqual(1);
      });

      it('should render a title', () => {
        expect(wrapper.find('div.card-list-title').length).toEqual(1);
      });

      it('should render a title with the right text', () => {
        expect(wrapper.find('div.card-list-title').text()).toEqual('Test Title');
      });

      it('should render two anchor tags - one around image one for the title', () => {
        expect(wrapper.find('article.list-item-simple').find('.list-anchor').length).toEqual(2);
        expect(wrapper.find('.card-list--link-container').find('Image').length).toEqual(1);
      });

      it('should render one image wrapped in an anchor tag', () => {
        expect(wrapper.find('article.list-item-simple').find('.list-anchor').find('Image').length).toEqual(1);
      });

      it('should render an anchor ', () => {
        expect(wrapper.find('article.list-item-simple').find('.list-anchor').at(0).find('a').length).toEqual(1);
      });

      it('should render an anchor and an image with the correct url', () => {
        const anchors = wrapper.find('article.list-item-simple').find('.list-anchor');
        expect(anchors.at(0).prop('href')).toEqual('/this/is/the/correct/url');
        expect(anchors.at(1).prop('href')).toEqual('/this/is/the/correct/url');
      });

      it('should render an anchor and an image with alt text', () => {
        expect(wrapper.find('article.list-item-simple').find('.list-anchor').find('Image').prop('alt')).toEqual('Article with a YouTube embed in it');
      });

      it('should render an overline', () => {
        expect(wrapper.find('Overline').length).toEqual(1);
      });

      it('should render a main headline', () => {
        expect(wrapper.find('div.card-list-headline').length).toEqual(1);
      });

      it('should render an author and a publish date section', () => {
        expect(wrapper.find('article.list-item-simple').find('.author-date').length).toEqual(1);
      });

      it('should render a byline', () => {
        expect(wrapper.find('.author-date').find('Byline').length).toEqual(1);
      });

      it('should render a separator', () => {
        expect(wrapper.find('Byline').prop('separator')).toEqual(true);
      });

      it('should render a publish date', () => {
        expect(wrapper.find('.author-date').find('ArticleDate').length).toEqual(1);
      });

      it('should not add the line divider', () => {
        expect(wrapper.find('article.list-item-simple--divider').length).toEqual(0);
      });
    });
  });

  describe('render one list item correctly', () => {
    const listContentConfig = {
      contentConfigValues: {
        offset: '0',
        query: 'type:story',
        size: '1',
      },
      contentService: 'story-feed-query',
    };
    const title = 'Test Title';
    const customFields = { listContentConfig, title };
    const { default: CardList } = require('./default');

    CardList.prototype.fetchContent = jest.fn().mockReturnValue(mockReturnData);
    const wrapper = mount(<CardList customFields={customFields} arcSite="the-sun" deployment={jest.fn((path) => path)} />);

    wrapper.setState({ cardList: mockData }, () => {
      wrapper.update();
      it('should render one parent wrapper', () => {
        expect(wrapper.find('.card-list-container').length).toEqual(1);
      });

      it('should render a parent for headline and a description', () => {
        expect(wrapper.find('article.card-list-item').length).toEqual(27);
      });

      it('should render a headline', () => {
        expect(wrapper.find('article.card-list-item').find('a.headline-list-anchor').length).toEqual(27);
        expect(wrapper.find('article.card-list-item').find('a.headline-list-anchor').find('PrimaryFont.headline-text').length).toEqual(27);
        expect(wrapper.find('article.card-list-item').find('a.headline-list-anchor').find('PrimaryFont.headline-text').first()
          .text()).toEqual('Jon’s Prod Story');
        expect(
          wrapper.find('article.card-list-item').find('.headline-list-anchor').at(0).prop('href'),
        ).toEqual('/this/is/the/correct/url');
      });

      it('should add the line divider when have multiple items', () => {
        expect(wrapper.find('hr').length).toEqual(27);
      });
    });
  });

  describe('render one list item correctly when list of authors is missing', () => {
    const listContentConfig = {
      contentConfigValues: {
        offset: '0',
        query: 'type:story',
        size: '1',
      },
      contentService: 'story-feed-query',
    };
    const customFields = { listContentConfig };
    const { default: CardList } = require('./default');

    CardList.prototype.fetchContent = jest.fn().mockReturnValue(withoutByline);
    const wrapper = mount(<CardList customFields={customFields} arcSite="the-sun" deployment={jest.fn((path) => path)} />);

    wrapper.setState({ cardList: withoutByline }, () => {
      wrapper.update();
      it('should render one parent wrapper', () => {
        expect(wrapper.find('div.card-list-container').length).toEqual(1);
      });
    });
  });

  describe('should not render overline if websites.artSite.website_section is missing', () => {
    const listContentConfig = {
      contentConfigValues: {
        offset: '0',
        query: 'type:story',
        size: '1',
      },
      contentService: 'story-feed-query',
    };
    const customFields = { listContentConfig };
    const { default: CardList } = require('./default');

    CardList.prototype.fetchContent = jest.fn().mockReturnValue(oneListItemWithoutSectionName);
    const wrapper = mount(<CardList customFields={customFields} arcSite="dagen" deployment={jest.fn((path) => path)} />);

    wrapper.setState({ cardList: oneListItemWithoutSectionName }, () => {
      wrapper.update();
      it('should not render overline', () => {
        expect(wrapper.find('.overline').length).toBe(0);
      });
      it('should render headline', () => {
        expect(wrapper.find('PrimaryFont.card-list-headline').length).toBe(1);
      });
      it('should render author-date', () => {
        expect(wrapper.find('.author-date').length).toBe(1);
      });
      it('should render image', () => {
        expect(wrapper.find('article.list-item-simple Image').length).toBe(1);
      });
    });
  });
});
