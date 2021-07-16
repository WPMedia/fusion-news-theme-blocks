import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { useFusionContext } from 'fusion:context';
import getTranslatedPhrases from 'fusion:intl';
import getProperties from 'fusion:properties';

import ResultsList from './default';

jest.mock('fusion:intl', () => ({
  __esModule: true,
  default: jest.fn((locale) => ({ t: jest.fn((phrase) => require('../../../intl.json')[phrase][locale]) })),
}));

getProperties.mockReturnValue({
  fallbackImage: 'placeholder.jpg',
  locale: 'en',
  resizerURL: 'https://resizer.me',
  primaryLogoAlt: 'image alt',
  breakpoints: {},
});

jest.mock('@wpmedia/resizer-image-block', () => ({
  extractResizedParams: jest.fn(),
  extractImageFromStory: jest.fn(),
}));

jest.mock('./results', () => ({
  __esModule: true,
  default: (params) => (
    <div>
      Results
      <div>
        {JSON.stringify(params)}
      </div>
    </div>
  ),
}));

describe('Results List', () => {
  it('should render Results if not lazy', () => {
    useFusionContext.mockReturnValue({
      arcSite: 'the-sun',
      contextPath: '/pf',
      deployment: jest.fn((path) => path),
      isAdmin: false,
    });
    const customFields = {
      lazyLoad: false,
      listContentConfig: {
        contentService: null,
        contentConfigValues: {
          offset: 0,
          size: 1,
        },
      },
    };

    const { unmount } = render(<ResultsList customFields={customFields} />);
    expect(screen.queryByText('Results')).toBeInTheDocument();
    unmount();
  });

  it('should render Results if lazy', () => {
    useFusionContext.mockReturnValue({
      arcSite: 'the-sun',
      contextPath: '/pf',
      deployment: jest.fn((path) => path),
      isAdmin: false,
    });
    const customFields = {
      lazyLoad: true,
      listContentConfig: {
        contentService: null,
        contentConfigValues: {
          offset: 0,
          size: 1,
        },
      },
    };

    const { unmount } = render(<ResultsList customFields={customFields} />);
    expect(screen.queryByText('Results')).toBeInTheDocument();
    unmount();
  });
});

describe('getFallbackImageURL', () => {
  it('should NOT call deployment with context path if http is contained in fallback image url', () => {
    const mockDeployment = jest.fn();

    useFusionContext.mockReturnValue({
      arcSite: 'the-sun',
      contextPath: '/pf',
      deployment: mockDeployment,
      isAdmin: false,
    });

    getProperties.mockReturnValue({
      fallbackImage: 'http://placeholder.jpg',
      locale: 'en',
      resizerURL: 'https://resizer.me',
      primaryLogoAlt: 'image alt',
      breakpoints: {},
    });

    const customFields = {
      lazyLoad: true,
      listContentConfig: {
        contentService: null,
        contentConfigValues: {
          offset: 0,
          size: 1,
        },
      },
    };

    const { unmount } = render(<ResultsList customFields={customFields} />);
    expect(mockDeployment).toHaveBeenCalledTimes(0);
    unmount();
  });
});

describe('phrases', () => {
  it('should default to "en" if locale is not configured', () => {
    const mockGetTranslatedPhrases = jest.fn();

    getTranslatedPhrases.mockImplementation(mockGetTranslatedPhrases);

    getProperties.mockReturnValue({
      fallbackImage: 'placeholder.jpg',
      locale: null,
      resizerURL: 'https://resizer.me',
      primaryLogoAlt: 'image alt',
      breakpoints: {},
    });

    const customFields = {
      lazyLoad: true,
      listContentConfig: {
        contentService: null,
        contentConfigValues: {
          offset: 0,
          size: 1,
        },
      },
    };

    const { unmount } = render(<ResultsList customFields={customFields} />);
    expect(mockGetTranslatedPhrases).toHaveBeenCalledWith('en');
    unmount();
  });
});

describe('configured values', () => {
  it('should default offset to 0 if not configured', () => {
    const customFields = {
      lazyLoad: true,
      listContentConfig: {
        contentService: null,
        contentConfigValues: {},
      },
    };

    const { unmount } = render(<ResultsList customFields={customFields} />);
    expect(screen.queryByText(/"configuredOffset":0/i)).toBeInTheDocument();
    unmount();
  });
  it('should default size to 10 if not configured', () => {
    const customFields = {
      lazyLoad: true,
      listContentConfig: {
        contentService: null,
        contentConfigValues: {},
      },
    };

    const { unmount } = render(<ResultsList customFields={customFields} />);
    expect(screen.queryByText(/"configuredSize":10/i)).toBeInTheDocument();
    unmount();
  });
});

describe('isServerSideLazy flag', () => {
  it('should be false if lazyLoad is false', () => {
    const customFields = {
      lazyLoad: false,
      listContentConfig: {
        contentService: null,
        contentConfigValues: {},
      },
    };

    const { unmount } = render(<ResultsList customFields={customFields} />);
    expect(screen.queryByText(/"isServerSideLazy":false/i)).toBeInTheDocument();
    unmount();
  });
  it('should be false if isAdmin is true', () => {
    useFusionContext.mockReturnValue({
      arcSite: 'the-sun',
      contextPath: '/pf',
      deployment: jest.fn(),
      isAdmin: true,
    });

    const customFields = {
      lazyLoad: true,
      listContentConfig: {
        contentService: null,
        contentConfigValues: {},
      },
    };

    const { unmount } = render(<ResultsList customFields={customFields} />);
    expect(screen.queryByText(/"isServerSideLazy":false/i)).toBeInTheDocument();
    unmount();
  });
});
