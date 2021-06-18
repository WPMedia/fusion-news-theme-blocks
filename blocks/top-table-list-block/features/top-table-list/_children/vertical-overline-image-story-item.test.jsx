import React from 'react';
import { mount, shallow } from 'enzyme';

const config = {
  showOverlineXL: true,
  showHeadlineXL: true,
  showImageXL: true,
  showDescriptionXL: true,
  showBylineXL: true,
  showDateXL: true,
  showOverlineLG: true,
  showHeadlineLG: true,
  showImageLG: true,
  showDescriptionLG: true,
  showBylineLG: true,
  showDateLG: true,
  showHeadlineMD: true,
  showImageMD: true,
  showDescriptionMD: true,
  showBylineMD: true,
  showDateMD: true,
  showHeadlineSM: true,
  showImageSM: true,
};

const imageURL = 'pic';
const itemTitle = 'title';
const descriptionText = 'description';
const websiteURL = 'https://arcxp.com';
const overlineText = 'News';

const sampleProps = {
  element: {
    headlines: {
      basic: itemTitle,
    },
    description: {
      basic: descriptionText,
    },
    websites: {
      'the-sun': {
        website_url: websiteURL,
        website_section: {
          _id: '/news',
          name: overlineText,
        },
      },
    },
    credits: { by: ['jack'] },
    promo_items: {
      basic: {
        type: 'image',
        url: imageURL,
        resized_params: {
          '400x267': 'VWgB9mYQ5--6WT0lD6nIw11D_yA=filters:cm=t/',
        },
      },
    },
  },
  id: 'test',
  customFields: config,
};
describe('vertical overline image story item', () => {
  beforeAll(() => {
    jest.mock('fusion:properties', () => (jest.fn(() => ({}))));
    jest.mock('fusion:themes', () => (jest.fn(() => ({}))));
    jest.mock('@wpmedia/engine-theme-sdk', () => ({
      Image: () => <img alt="placeholder" />,
      extractVideoEmbedFromStory: jest.fn(() => '<div class="video-embed"></div>'),
      VideoPlayer: ({ embedHTML, id }) => <div dangerouslySetInnerHTML={{ __html: embedHTML }} id={`video-${id}`} />,
      formatURL: jest.fn((input) => input.toString()),
      Overline: () => <div />,
    }));
    jest.mock('fusion:context', () => ({
      useFusionContext: jest.fn(() => ({
        arcSite: 'the-sun',
        globalContent: {},
      })),
      useComponentContext: jest.fn(() => ({
        registerSuccessEvent: () => ({}),
      })),
    }));
    jest.mock('fusion:content', () => ({
      useEditableContent: jest.fn(() => ({ editableContent: () => ({ contentEditable: 'true' }) })),
      useContent: jest.fn(),
    }));
  });
  afterAll(() => {
    jest.resetModules();
  });

  it('renders image and overline with full props', () => {
    const { default: VerticalOverlineImageStoryItem } = require('./vertical-overline-image-story-item');

    const wrapper = mount(<VerticalOverlineImageStoryItem {...sampleProps} />);

    // doesn't show placeholder
    expect(wrapper.find('.top-table-extra-large-image-placeholder').length).toBe(0);
    // finds overline
    expect(wrapper.find('.overline').exists()).toBe(true);

    // does not find default spacing for headline descriptions
    expect(wrapper.find('.headline-description-spacing').length).toBe(0);

    // has the correct link
    expect(wrapper.find('a.xl-promo-headline').length).toBe(1);
    expect(wrapper.find('a.xl-promo-headline').props().href).toBe(websiteURL);

    expect(wrapper.find('VerticalOverlineImageStoryItem > hr').length).toBe(1);
    expect(wrapper.find('Image')).toHaveLength(1);
    expect(wrapper.find('VideoPlayer')).toHaveLength(0);
  });

  it('doesn\'t render overline if not requested', () => {
    const { default: VerticalOverlineImageStoryItem } = require('./vertical-overline-image-story-item');
    const testProps = {
      ...sampleProps,
      customFields: {
        ...sampleProps.customFields,
        showOverlineXL: false,
      },
    };
    const wrapper = mount(<VerticalOverlineImageStoryItem {...testProps} />);
    expect(wrapper.find('a.overline').length).toBe(0);
  });

  it('doesn\'t render headline if not requested', () => {
    const { default: VerticalOverlineImageStoryItem } = require('./vertical-overline-image-story-item');
    const testProps = {
      ...sampleProps,
      customFields: {
        ...sampleProps.customFields,
        showHeadlineXL: false,
      },
    };
    const wrapper = mount(<VerticalOverlineImageStoryItem {...testProps} />);
    expect(wrapper.find('a.lg-promo-headline').length).toBe(0);
  });

  it('doesn\'t render image if not requested', () => {
    const { default: VerticalOverlineImageStoryItem } = require('./vertical-overline-image-story-item');
    const testProps = {
      ...sampleProps,
      customFields: {
        ...sampleProps.customFields,
        showImageXL: false,
      },
    };
    const wrapper = mount(<VerticalOverlineImageStoryItem {...testProps} />);
    expect(wrapper.find('Image').length).toBe(0);
  });

  it('doesn\'t render description if not requested', () => {
    const { default: VerticalOverlineImageStoryItem } = require('./vertical-overline-image-story-item');
    const testProps = {
      ...sampleProps,
      customFields: {
        ...sampleProps.customFields,
        showDescriptionXL: false,
      },
    };
    const wrapper = mount(<VerticalOverlineImageStoryItem {...testProps} />);
    expect(wrapper.find('PromoDescription').length).toBe(0);
  });

  it('doesn\'t render byline if not requested', () => {
    const { default: VerticalOverlineImageStoryItem } = require('./vertical-overline-image-story-item');
    const testProps = {
      ...sampleProps,
      customFields: {
        ...sampleProps.customFields,
        showBylineXL: false,
      },
    };
    const wrapper = mount(<VerticalOverlineImageStoryItem {...testProps} />);
    expect(wrapper.find('Byline').length).toBe(0);
  });

  it('doesn\'t render date if not requested', () => {
    const { default: VerticalOverlineImageStoryItem } = require('./vertical-overline-image-story-item');
    const testProps = {
      ...sampleProps,
      customFields: {
        ...sampleProps.customFields,
        showDateXL: false,
      },
    };
    const wrapper = mount(<VerticalOverlineImageStoryItem {...testProps} />);
    expect(wrapper.find('PromoDate').length).toBe(0);
  });

  it('renders nothing with no/invalid customFields', () => {
    const { default: VerticalOverlineImageStoryItem } = require('./vertical-overline-image-story-item');

    const { customFields, ...testProps } = sampleProps;
    const wrapper = mount(<VerticalOverlineImageStoryItem {...testProps} />);

    expect(wrapper.find('a.overline').length).toBe(0);
    expect(wrapper.find('a.lg-promo-headline').length).toBe(0);
    expect(wrapper.find('Image').length).toBe(0);
    expect(wrapper.find('PromoDescription').length).toBe(0);
    expect(wrapper.find('Byline').length).toBe(0);
    expect(wrapper.find('PromoDate').length).toBe(0);
  });

  it('does not render image, overline and byline with empty props', () => {
    const testProps = {
      element: {},
      customFields: config,
    };
    const { default: VerticalOverlineImageStoryItem } = require('./vertical-overline-image-story-item');

    const wrapper = mount(<VerticalOverlineImageStoryItem {...testProps} />);

    // matches props
    expect(wrapper.props()).toMatchObject(testProps);

    expect(wrapper.find('PlaceholderImage').length).toBe(1);

    // finds overline
    expect(wrapper.find('a.overline').length).toBe(0);

    expect(wrapper.find('VerticalOverlineImageStoryItem > hr').length).toBe(1);
  });

  it('renders VideoPlayer when type "story" with video lead art', () => {
    const testProps = {
      element: {
        ...sampleProps.element,
        type: 'story',
        promo_items: {
          lead_art: {
            type: 'video',
            embed_html: '<div></div>',
          },
        },
      },
      customFields: {
        ...config,
        playVideoInPlaceXL: true,
      },
    };

    const { default: VerticalOverlineImageStoryItem } = require('./vertical-overline-image-story-item');

    const wrapper = mount(<VerticalOverlineImageStoryItem {...testProps} />);

    expect(wrapper.find('.top-table-extra-large-image-placeholder').length).toBe(0);
    expect(wrapper.find('Overline').exists()).toBe(true);
    expect(wrapper.find('a.xl-promo-headline').length).toBe(1);
    expect(wrapper.find('a.xl-promo-headline').prop('href')).toBe(websiteURL);
    expect(wrapper.find('hr').length).toBe(1);
    expect(wrapper.find('hr').hasClass('hr-borderless')).toBe(false);
    expect(wrapper.find('Image')).toHaveLength(0);
    expect(wrapper.find('VideoPlayer')).toHaveLength(1);
  });

  it('will not renders VideoPlayer when playInPlace disabled', () => {
    const testProps = {
      customFields: {
        ...config,
        playVideoInPlaceXL: false,
      },
    };
    const { default: VerticalOverlineImageStoryItem } = require('./vertical-overline-image-story-item');
    const wrapper = mount(<VerticalOverlineImageStoryItem {...testProps} />);
    expect(wrapper.find('VideoPlayer')).toHaveLength(0);
  });

  it('renders VideoPlayer when type "video" with embed without bottom border', () => {
    const testProps = {
      element: {
        ...sampleProps.element,
        type: 'video',
        embed_html: '<div></div>',
      },
      customFields: {
        ...config,
        showHeadlineXL: false,
        showDateXL: false,
        playVideoInPlaceXL: true,
        showBottomBorderXL: false,
      },
    };

    const { default: VerticalOverlineImageStoryItem } = require('./vertical-overline-image-story-item');

    const wrapper = shallow(<VerticalOverlineImageStoryItem {...testProps} />);

    expect(wrapper.find('.top-table-extra-large-image-placeholder').length).toBe(0);
    expect(wrapper.find('Overline').length).toBe(1);
    expect(wrapper.find('a.xl-promo-headline').length).toBe(0);
    expect(wrapper.find('hr').hasClass('hr-borderless')).toBe(true);
    expect(wrapper.find('Image')).toHaveLength(0);
    expect(wrapper.find('VideoPlayer')).toHaveLength(1);
  });

  it('renders VideoPlayer when type "video" with embed', () => {
    const testProps = {
      element: {
        ...sampleProps.element,
        type: 'video',
        embed_html: '<div></div>',
      },
      customFields: {
        ...config,
        showHeadlineXL: false,
        showDateXL: false,
        playVideoInPlaceXL: true,
        showBottomBorderXL: true,
      },
    };

    const { default: VerticalOverlineImageStoryItem } = require('./vertical-overline-image-story-item');

    const wrapper = shallow(<VerticalOverlineImageStoryItem {...testProps} />);

    expect(wrapper.find('.top-table-extra-large-image-placeholder').length).toBe(0);
    expect(wrapper.find('Overline').length).toBe(1);
    expect(wrapper.find('a.xl-promo-headline').length).toBe(0);
    expect(wrapper.find('hr').length).toBe(1);
    expect(wrapper.find('Image')).toHaveLength(0);
    expect(wrapper.find('VideoPlayer')).toHaveLength(1);
  });
});

describe('settings export', () => {
  beforeAll(() => {
    jest.mock('@wpmedia/engine-theme-sdk', () => ({
      videoPlayerCustomFieldTags: {
        shrinkToFit: {
          type: {
            tag: () => ({
              testProp: 'testValue',
              group: 'testGroup',
            }),
          },
        },
        viewportPercentage: {
          type: {
            tag: () => ({
              testProp: 'testValue',
              group: 'testGroup',
            }),
          },
        },
      },
    }));
  });
  afterAll(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('must export the pagebuilder settings', () => {
    const { verticalOverlineImageStoryFields } = require('./vertical-overline-image-story-item');

    const expectedFields = {
      shrinkToFitXL: {
        testProp: 'testValue',
        group: 'testGroup',
      },
      viewportPercentageXL: {
        testProp: 'testValue',
        group: 'testGroup',
      },
    };

    expect(verticalOverlineImageStoryFields('group')).toStrictEqual(expectedFields);
  });
});
