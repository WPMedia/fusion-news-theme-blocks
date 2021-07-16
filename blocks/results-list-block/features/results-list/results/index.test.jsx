import React from 'react';

import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { useContent } from 'fusion:content';

import Results from './index';

jest.mock('./result-item', () => {
  /* eslint-disable-next-line no-shadow */
  const React = require('react');
  return {
    __esModule: true,
    default: React.forwardRef(
      (props, ref) => (
        <div ref={ref}>
          Result Item
          { props.showHeadline
            ? <a href="valid">{JSON.stringify(props)}</a>
            : null}
        </div>
      ),
    ),
  };
});

const fallbackImage = 'http://test/resources/fallback.jpg';

const fusionProperties = {
  breakpoints: {},
  fallbackImage,
  locale: 'en',
  primaryLogoAlt: 'logo alt',
  resizerURL: 'https://resizer.me',
};

const imageProperties = {
  smallWidth: 158,
  smallHeight: 89,
  mediumWidth: 274,
  mediumHeight: 154,
  largeWidth: 274,
  largeHeight: 154,
  primaryLogoAlt: fusionProperties.primaryLogoAlt,
  breakpoints: fusionProperties.breakpoints,
  resizerURL: fusionProperties.resizerURL,
};

const mockContent = [{
  content_elements: [{
    description: { basic: 'Description 1' },
    display_date: '2021-01-01T00:01:00Z',
    headlines: { basic: 'Test headline 1' },
    websites: { 'the-sun': { website_url: 'https://the-sun/1' } },
    _id: 'element_1',
  }],
  count: 5,
  next: 2,
  _id: 'query1',
}, {
  content_elements: [{
    description: { basic: 'Description 2' },
    display_date: '2021-01-01T00:02:00Z',
    headlines: { basic: 'Test headline 2' },
    websites: { 'the-sun': { website_url: 'https://the-sun/2' } },
    _id: 'element_2',
  }],
  count: 5,
  next: 3,
  _id: 'query2',
}, {
  content_elements: [{
    description: { basic: 'Description 3' },
    display_date: '2021-01-01T00:03:00Z',
    headlines: { basic: 'Test headline 3' },
    websites: { 'the-sun': { website_url: 'https://the-sun/3' } },
    _id: 'element_3',
  }],
  count: 5,
  next: 4,
  _id: 'query3',
}, {
  content_elements: [{
    description: { basic: 'Description 4' },
    display_date: '2021-01-01T00:04:00Z',
    headlines: { basic: 'Test headline 4' },
    websites: { 'the-sun': { website_url: 'https://the-sun/4' } },
    _id: 'element_4',
  }],
  count: 5,
  next: 5,
  _id: 'query4',
}, {
  content_elements: [{
    description: { basic: 'Description 5' },
    display_date: '2021-01-01T00:05:00Z',
    headlines: { basic: 'Test headline 5' },
    websites: { 'the-sun': { website_url: 'https://the-sun/5' } },
    _id: 'element_5',
  }],
  count: 5,
  _id: 'query5',
}];

const mockLastItemContent = [{
  content_elements: [{
    description: { basic: 'Description 1' },
    display_date: '2021-01-01T00:01:00Z',
    headlines: { basic: 'Test headline 1' },
    websites: { 'the-sun': { website_url: 'https://the-sun/1' } },
    _id: 'element_1',
  }],
  count: 1,
  _id: 'query1',
}];

jest.mock('fusion:content', () => ({
  useContent: jest.fn(),
}));

jest.mock('fusion:themes', () => (jest.fn(() => ({}))));

const mockPhrases = {
  t: jest.fn((phraseString) => {
    switch (phraseString) {
      case 'results-list-block.see-more-button': {
        return 'See More';
      }
      case 'results-list-block.see-more-button-aria-label': {
        return 'button';
      }
      default: {
        break;
      }
    }
    return '';
  }),
};

describe('seeMore', () => {
  it('should trigger a state update', () => {
    useContent
      .mockReset()
      .mockReturnValueOnce({})
      .mockReturnValueOnce(mockContent[0])
      .mockReturnValueOnce({})
      .mockReturnValueOnce(mockContent[1]);

    const { unmount } = render(
      <Results
        arcSite="the-sun"
        configuredOffset={0}
        configuredSize={1}
        contentConfigValues={{}}
        contentService="story-feed-query"
        phrases={mockPhrases}
        showHeadline
        imageProperties={imageProperties}
        targetFallbackImage={fallbackImage}
      />,
    );

    expect(screen.getAllByText(/Result Item/i)).toHaveLength(1);

    fireEvent.click(screen.getByText('See More'));

    expect(screen.getAllByText(/Result Item/i)).toHaveLength(2);

    expect(useContent).toHaveBeenCalled();
    unmount();
  });

  it('should not show for the last items', () => {
    useContent
      .mockReset()
      .mockReturnValueOnce({})
      .mockReturnValueOnce(mockLastItemContent[0]);

    const { unmount } = render(
      <Results
        arcSite="the-sun"
        configuredOffset={0}
        configuredSize={1}
        contentConfigValues={{}}
        contentService="story-feed-query"
        phrases={mockPhrases}
        showHeadline
        imageProperties={imageProperties}
        targetFallbackImage={fallbackImage}
      />,
    );

    expect(screen.queryByText('See More')).not.toBeInTheDocument();

    unmount();
  });
});

describe('focus', () => {
  it('should not be set on the very first item on the page', () => {
    useContent
      .mockReset()
      .mockReturnValueOnce({})
      .mockReturnValueOnce(mockContent[0]);

    const { unmount } = render(
      <Results
        arcSite="the-sun"
        configuredOffset={0}
        configuredSize={1}
        contentConfigValues={{}}
        contentService="story-feed-query"
        phrases={mockPhrases}
        showHeadline
        imageProperties={imageProperties}
        targetFallbackImage={fallbackImage}
      />,
    );
    expect(screen.getByText(/"_id":"element_1"/i)).not.toHaveFocus();
    unmount();
  });

  it('should be set on the first new item added', () => {
    useContent
      .mockReset()
      .mockReturnValueOnce({})
      .mockReturnValueOnce(mockContent[0])
      .mockReturnValueOnce({})
      .mockReturnValueOnce(mockContent[1]);

    const { unmount } = render(
      <Results
        arcSite="the-sun"
        configuredOffset={0}
        configuredSize={1}
        contentConfigValues={{}}
        contentService="story-feed-query"
        phrases={mockPhrases}
        showHeadline
        imageProperties={imageProperties}
        targetFallbackImage={fallbackImage}
      />,
    );
    fireEvent.click(screen.getByText('See More'));
    expect(screen.getByText(/"_id":"element_2"/i)).toHaveFocus();
    unmount();
  });

  it('should not set focus if there is no link', () => {
    useContent
      .mockReset()
      .mockReturnValueOnce({})
      .mockReturnValueOnce(mockContent[0])
      .mockReturnValueOnce({})
      .mockReturnValueOnce(mockContent[1]);

    const { unmount } = render(
      <Results
        arcSite="the-sun"
        configuredOffset={0}
        configuredSize={1}
        contentConfigValues={{}}
        contentService="story-feed-query"
        phrases={mockPhrases}
        imageProperties={imageProperties}
        targetFallbackImage={fallbackImage}
        showDescription
      />,
    );
    fireEvent.click(screen.getByText('See More'));
    expect(screen.getAllByText(/Result Item/i)[1]).not.toHaveFocus();
    unmount();
  });
});

describe('story-feed-query service', () => {
  it('should call useContent with appropriate query parameters', () => {
    useContent
      .mockReset()
      .mockReturnValueOnce({})
      .mockReturnValueOnce(mockContent[0])
      .mockReturnValueOnce({})
      .mockReturnValueOnce(mockContent[1]);

    const { unmount } = render(
      <Results
        arcSite="the-sun"
        configuredOffset={0}
        configuredSize={1}
        contentConfigValues={{}}
        contentService="story-feed-query"
        phrases={mockPhrases}
        showHeadline
        imageProperties={imageProperties}
        targetFallbackImage={fallbackImage}
      />,
    );

    expect(useContent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        query: {
          feature: 'results-list',
          offset: 0,
          size: 2,
        },
      }),
    );

    fireEvent.click(screen.getByText('See More'));

    expect(useContent).toHaveBeenLastCalledWith(
      expect.objectContaining({
        query: {
          feature: 'results-list',
          offset: 2,
          size: 1,
        },
      }),
    );

    unmount();
  });
});

describe('content-api-collections service', () => {
  it('should call useContent with appropriate query parameters', () => {
    useContent
      .mockReset()
      .mockReturnValueOnce({})
      .mockReturnValueOnce(mockContent[0])
      .mockReturnValueOnce({})
      .mockReturnValueOnce(mockContent[1]);

    const { unmount } = render(
      <Results
        arcSite="the-sun"
        configuredOffset={0}
        configuredSize={1}
        contentConfigValues={{}}
        contentService="content-api-collections"
        phrases={mockPhrases}
        showHeadline
        imageProperties={imageProperties}
        targetFallbackImage={fallbackImage}
      />,
    );

    expect(useContent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        query: {
          feature: 'results-list',
          from: 0,
          size: 2,
        },
      }),
    );

    fireEvent.click(screen.getByText('See More'));

    expect(useContent).toHaveBeenLastCalledWith(
      expect.objectContaining({
        query: {
          feature: 'results-list',
          from: 2,
          size: 1,
        },
      }),
    );

    unmount();
  });
});

describe('story-feed-author service', () => {
  it('should call useContent with appropriate query parameters', () => {
    useContent
      .mockReset()
      .mockReturnValueOnce({})
      .mockReturnValueOnce(mockContent[0])
      .mockReturnValueOnce({})
      .mockReturnValueOnce(mockContent[1]);

    const { unmount } = render(
      <Results
        arcSite="the-sun"
        configuredOffset={0}
        configuredSize={1}
        contentConfigValues={{}}
        contentService="story-feed-author"
        phrases={mockPhrases}
        showHeadline
        imageProperties={imageProperties}
        targetFallbackImage={fallbackImage}
      />,
    );

    expect(useContent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        query: {
          feature: 'results-list',
          feedOffset: 0,
          feedSize: 2,
        },
      }),
    );

    fireEvent.click(screen.getByText('See More'));

    expect(useContent).toHaveBeenLastCalledWith(
      expect.objectContaining({
        query: {
          feature: 'results-list',
          feedOffset: 2,
          feedSize: 1,
        },
      }),
    );

    unmount();
  });
});

describe('story-feed-sections service', () => {
  it('should call useContent with appropriate query parameters', () => {
    useContent
      .mockReset()
      .mockReturnValueOnce({})
      .mockReturnValueOnce(mockContent[0])
      .mockReturnValueOnce({})
      .mockReturnValueOnce(mockContent[1]);

    const { unmount } = render(
      <Results
        arcSite="the-sun"
        configuredOffset={0}
        configuredSize={1}
        contentConfigValues={{}}
        contentService="story-feed-sections"
        phrases={mockPhrases}
        showHeadline
        imageProperties={imageProperties}
        targetFallbackImage={fallbackImage}
      />,
    );

    expect(useContent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        query: {
          feature: 'results-list',
          feedOffset: 0,
          feedSize: 2,
        },
      }),
    );

    fireEvent.click(screen.getByText('See More'));

    expect(useContent).toHaveBeenLastCalledWith(
      expect.objectContaining({
        query: {
          feature: 'results-list',
          feedOffset: 2,
          feedSize: 1,
        },
      }),
    );

    unmount();
  });
});

describe('story-feed-tag service', () => {
  it('should call useContent with appropriate query parameters', () => {
    useContent
      .mockReset()
      .mockReturnValueOnce({})
      .mockReturnValueOnce(mockContent[0])
      .mockReturnValueOnce({})
      .mockReturnValueOnce(mockContent[1]);

    const { unmount } = render(
      <Results
        arcSite="the-sun"
        configuredOffset={0}
        configuredSize={1}
        contentConfigValues={{}}
        contentService="story-feed-tag"
        phrases={mockPhrases}
        showHeadline
        imageProperties={imageProperties}
        targetFallbackImage={fallbackImage}
      />,
    );

    expect(useContent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        query: {
          feature: 'results-list',
          feedOffset: 0,
          feedSize: 2,
        },
      }),
    );

    fireEvent.click(screen.getByText('See More'));

    expect(useContent).toHaveBeenLastCalledWith(
      expect.objectContaining({
        query: {
          feature: 'results-list',
          feedOffset: 2,
          feedSize: 1,
        },
      }),
    );

    unmount();
  });
});

describe('unknown service', () => {
  it('should call useContent with appropriate query parameters', () => {
    useContent
      .mockReset()
      .mockReturnValueOnce({})
      .mockReturnValueOnce(mockContent[0])
      .mockReturnValueOnce({})
      .mockReturnValueOnce(mockContent[1]);

    const { unmount } = render(
      <Results
        arcSite="the-sun"
        configuredOffset={0}
        configuredSize={1}
        contentConfigValues={{
          defaultOffset: 0,
          defaultSize: 1,
        }}
        contentService="unknown"
        phrases={mockPhrases}
        showHeadline
        imageProperties={imageProperties}
        targetFallbackImage={fallbackImage}
      />,
    );

    expect(useContent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        query: {
          feature: 'results-list',
          defaultOffset: 0,
          defaultSize: 1,
        },
      }),
    );

    unmount();
  });
});

describe('lazy flags', () => {
  it('should return nothing if isServerSideLazy is true', () => {
    useContent
      .mockReset()
      .mockReturnValueOnce({})
      .mockReturnValueOnce(mockContent[0])
      .mockReturnValueOnce({})
      .mockReturnValueOnce(mockContent[1]);

    const { unmount } = render(
      <Results
        arcSite="the-sun"
        configuredOffset={0}
        configuredSize={1}
        contentConfigValues={{
          defaultOffset: 0,
          defaultSize: 1,
        }}
        contentService="unknown"
        phrases={mockPhrases}
        showHeadline
        imageProperties={imageProperties}
        targetFallbackImage={fallbackImage}
        isServerSideLazy
      />,
    );

    expect(screen.queryByText(/Result Item/i)).not.toBeInTheDocument();

    unmount();
  });
});

describe('fallback image', () => {
  it('should return even if the fallback image is not a /resource/ path', () => {
    useContent
      .mockReset()
      .mockReturnValueOnce({})
      .mockReturnValueOnce(mockContent[0])
      .mockReturnValueOnce({})
      .mockReturnValueOnce(mockContent[1]);

    const { unmount } = render(
      <Results
        arcSite="the-sun"
        configuredOffset={0}
        configuredSize={1}
        contentConfigValues={{
          defaultOffset: 0,
          defaultSize: 1,
        }}
        contentService="unknown"
        phrases={mockPhrases}
        showHeadline
        imageProperties={imageProperties}
        targetFallbackImage="http://test/fallback.jpg"
      />,
    );

    expect(screen.queryByText(/"targetFallbackImage":"http:\/\/test\/fallback.jpg"/i)).toBeInTheDocument();

    unmount();
  });
});
