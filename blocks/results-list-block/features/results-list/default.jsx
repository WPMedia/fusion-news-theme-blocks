/* eslint-disable camelcase */
import PropTypes from 'prop-types';
import Consumer from 'fusion:consumer';
import React, { Component } from 'react';

import ArticleDate from '@wpmedia/date-block';
import styled from 'styled-components';
import getThemeStyle from 'fusion:themes';
import getProperties from 'fusion:properties';
import getTranslatedPhrases from 'fusion:intl';

import { Image, LazyLoad, isServerSide } from '@wpmedia/engine-theme-sdk';
import { extractResizedParams } from '@wpmedia/resizer-image-block';
import { Byline } from '@wpmedia/shared-styles';
import { resolveDefaultPromoElements, fetchStoriesTransform } from './helpers';

// shared with search results list
// to modify, go to the shared styles block
import '@wpmedia/shared-styles/scss/_results-list.scss';
import '@wpmedia/shared-styles/scss/_results-list-desktop.scss';
import '@wpmedia/shared-styles/scss/_results-list-mobile.scss';

function extractImage(promo) {
  return promo && promo.basic && promo.basic.type === 'image' && promo.basic.url;
}

const HeadlineText = styled.h2`
  font-family: ${(props) => props.primaryFont};
`;

const DescriptionText = styled.p`
  font-family: ${(props) => props.secondaryFont};
`;

const ReadMoreButton = styled.button`
  background-color: ${(props) => props.primaryColor};

  &:not(:disabled):not(.disabled):active:hover,
  &:not(:disabled):not(.disabled):hover:hover {
    background-color: ${(props) => props.primaryColor};
  }
`;

@Consumer
class ResultsList extends Component {
  constructor(props) {
    super(props);
    const { lazyLoad = false } = props.customFields || {};

    this.arcSite = props.arcSite;
    this.state = {
      resultList: {},
      seeMore: true,
      placeholderResizedImageOptions: {},
      focusItem: 0,
    };
    this.phrases = getTranslatedPhrases(getProperties(props.arcSite).locale || 'en');
    this.listItemRefs = {};

    this.lazyLoad = lazyLoad;
    this.isAdmin = props.isAdmin;

    this.fetchPlaceholder();

    // Fetch stories if lazyLoad is not enabled, the code is running on the server
    if (!this.lazyLoad && isServerSide()) {
      this.fetchStories(false);
    }
  }

  componentDidMount() {
    this.fetchStories(false);
  }

  componentDidUpdate(prevProps, prevState) {
    const prevFocusItem = prevState.focusItem;
    const { focusItem, resultList } = this.state;

    if (prevFocusItem === focusItem && prevFocusItem > 0) {
      const nextItem = resultList.content_elements[focusItem];
      if (nextItem?._id) {
        this.listItemRefs[nextItem._id].querySelector('a:not([aria-hidden])').focus();
      }
    }
  }

  getFallbackImageURL() {
    const { arcSite, deployment, contextPath } = this.props;
    let targetFallbackImage = getProperties(arcSite).fallbackImage;

    if (!targetFallbackImage.includes('http')) {
      targetFallbackImage = deployment(`${contextPath}/${targetFallbackImage}`);
    }

    return targetFallbackImage;
  }

  fetchPlaceholder() {
    const targetFallbackImage = this.getFallbackImageURL();

    if (!targetFallbackImage.includes('/resources/')) {
      this.fetchContent({
        placeholderResizedImageOptions: {
          source: 'resize-image-api',
          query: { raw_image_url: targetFallbackImage, respect_aspect_ratio: true },
        },
      });
    }
  }

  contentSourceFilter() {
    return `{
      count
      next
      content_elements {
        _id,
        type
        display_date
        credits {
          by {
            _id
            name
            url
            type
            additional_properties {
              original {
                byline
              }
            }
          }
        }
        headlines {
          basic
        }
        description {
          basic
        }
        promo_items {
          basic {
            type
            url
            resized_params {
              274x154
              158x89
            }
          }
        }
        websites {
          ${this.arcSite} {
            website_url
          }
        }
      }
    }`;
  }

  fetchStories(additionalStoryAmount) {
    const { customFields: { listContentConfig } } = this.props;
    const { contentService, contentConfigValues } = listContentConfig;
    if (additionalStoryAmount) {
      const { resultList } = this.state;
      const currentCount = resultList?.content_elements?.length;
      // Check for next value
      if (resultList.next) {
        // Determine content service type
        let value;
        switch (listContentConfig.contentService) {
          case 'story-feed-query':
            value = parseInt(contentConfigValues.size, 10);
            contentConfigValues.offset = (resultList.next).toString();
            value += resultList.next;
            break;
          case 'story-feed-author':
          case 'story-feed-sections':
          case 'story-feed-tag':
            value = parseInt(contentConfigValues.feedSize, 10);
            contentConfigValues.feedOffset = (resultList.next).toString();
            value += resultList.next;
            break;
          default:
            break;
        }
        this.fetchContent({
          resultList: {
            source: contentService,
            query: { ...contentConfigValues, feature: 'results-list' },
            filter: this.contentSourceFilter(),
            transform: (data) => fetchStoriesTransform(data, resultList),
          },
        });
        // Hide button if no more stories to load
        if (value >= resultList.count) {
          this.setState({
            seeMore: false,
          });
        }
      } else if (listContentConfig.contentService === 'content-api-collections') {
        let from = parseInt(contentConfigValues.from, 10) || 0;
        const size = parseInt(contentConfigValues.size, 10) || 10;
        contentConfigValues.from = String(from + size);
        this.fetchContent({
          resultList: {
            source: contentService,
            query: { ...contentConfigValues, feature: 'results-list' },
            filter: this.contentSourceFilter(),
            transform: (data) => fetchStoriesTransform(data, resultList),
          },
        });

        const query = { ...contentConfigValues, feature: 'results-list' };
        from = parseInt(contentConfigValues.from, 10) || 0;
        query.from = String(from + size);
        this.fetchContent({
          seeMore: {
            source: contentService,
            query,
            filter: this.contentSourceFilter(),
            transform: (data) => !!(data?.content_elements?.length),
          },
        });
      }

      this.setState({
        focusItem: currentCount,
      });
    } else {
      this.fetchContent({
        resultList: {
          source: listContentConfig.contentService,
          query: { ...contentConfigValues, feature: 'results-list' },
          filter: this.contentSourceFilter(),
        },
      });

      const { resultList } = this.state;
      if (resultList?.content_elements
        && resultList?.count
        && resultList.content_elements.length >= resultList.count) {
        this.setState({ seeMore: false });
      }

      if (listContentConfig.contentService === 'content-api-collections') {
        const query = { ...contentConfigValues };
        const from = parseInt(contentConfigValues.from, 10) || 0;
        const size = parseInt(contentConfigValues.size, 10) || 10;
        query.from = String(from + size);
        const { fetched: nextPage } = this.getContent('content-api-collections', query);
        nextPage.then((data) => {
          this.setState({ seeMore: !!(data?.content_elements?.length) });
        });
      }
    }
  }

  render() {
    if (this.lazyLoad && isServerSide() && !this.isAdmin) { // On Server
      return null;
    }

    const {
      arcSite,
      customFields,
    } = this.props;
    const {
      resultList: { content_elements: contentElements = [] } = {}, seeMore,
      placeholderResizedImageOptions,
    } = this.state;
    const targetFallbackImage = this.getFallbackImageURL();
    const promoElements = resolveDefaultPromoElements(customFields);

    const Results = () => (
      <div className="results-list-container">
        {contentElements && contentElements.length > 0 && contentElements.map((element) => {
          const {
            description: { basic: descriptionText } = {},
            headlines: { basic: headlineText } = {},
            display_date: displayDate,
            promo_items: promoItems,
            websites,
          } = element;

          if (!websites[arcSite]) {
            return null;
          }

          const url = websites[arcSite].website_url;
          return (
            <div
              className="list-item"
              key={`result-card-${url}`}
              ref={(ref) => {
                this.listItemRefs[element._id] = ref;
              }}
            >
              { promoElements.showImage && (
              <div className="results-list--image-container mobile-order-2 mobile-image">
                <a
                  href={url}
                  title={headlineText}
                  aria-hidden="true"
                  tabIndex="-1"
                >
                  {extractImage(promoItems) ? (
                    <Image
                      // results list is 16:9 by default
                      resizedImageOptions={extractResizedParams(element)}
                      url={extractImage(element.promo_items)}
                      alt={headlineText}
                      smallWidth={158}
                      smallHeight={89}
                      mediumWidth={274}
                      mediumHeight={154}
                      largeWidth={274}
                      largeHeight={154}
                      breakpoints={getProperties(arcSite)?.breakpoints}
                      resizerURL={getProperties(arcSite)?.resizerURL}
                    />
                  ) : (
                    <Image
                      smallWidth={158}
                      smallHeight={89}
                      mediumWidth={274}
                      mediumHeight={154}
                      largeWidth={274}
                      largeHeight={154}
                      alt={getProperties(arcSite).primaryLogoAlt || 'Placeholder logo'}
                      url={targetFallbackImage}
                      breakpoints={getProperties(arcSite)?.breakpoints}
                      resizedImageOptions={placeholderResizedImageOptions}
                      resizerURL={getProperties(arcSite)?.resizerURL}
                    />
                  )}
                </a>
              </div>
              )}
              { promoElements.showHeadline && (
              <div className="results-list--headline-container mobile-order-1">
                <a
                  href={url}
                  title={headlineText}
                >
                  <HeadlineText
                    primaryFont={getThemeStyle(this.arcSite)['primary-font-family']}
                    className="headline-text"
                  >
                    {headlineText}
                  </HeadlineText>
                </a>
              </div>
              )}
              { (
                promoElements.showDescription
            || promoElements.showDate
            || promoElements.showByline
              ) && (
              <div className="results-list--description-author-container mobile-order-3">
                {promoElements.showDescription && descriptionText && (
                <a
                  href={url}
                  title={headlineText}
                >
                  <DescriptionText
                    secondaryFont={getThemeStyle(this.arcSite)['secondary-font-family']}
                    className="description-text"
                  >
                    {descriptionText}
                  </DescriptionText>
                </a>
                )}
                { (promoElements.showDate || promoElements.showByline) && (
                <div className="results-list--author-date">
                  { promoElements.showByline
                    && <Byline content={element} list separator={promoElements.showDate} /> }
                  { promoElements.showDate && <ArticleDate classNames="story-date" date={displayDate} /> }
                </div>
                )}
              </div>
              )}
            </div>
          );
        })}
        {
    !!(contentElements && contentElements.length > 0 && seeMore) && (
      <div className="see-more">
        <ReadMoreButton
          type="button"
          onClick={() => this.fetchStories(true)}
          className="btn btn-sm"
          primaryColor={getThemeStyle(arcSite)['primary-color']}
        >
          {this.phrases.t('results-list-block.see-more-button')}
          {' '}
          <span className="visuallyHidden">
            stories about this topic
          </span>
        </ReadMoreButton>
      </div>
    )
  }
      </div>
    );

    return (
      <LazyLoad enabled={this.lazyLoad && !this.isAdmin}>
        <Results />
      </LazyLoad>
    );
  }
}

ResultsList.label = 'Results List – Arc Block';

ResultsList.propTypes = {
  customFields: PropTypes.shape({
    listContentConfig: PropTypes.contentConfig('ans-feed').tag({
      group: 'Configure Content',
      label: 'Display Content Info',
    }),
    showHeadline: PropTypes.bool.tag(
      {
        label: 'Show headline',
        defaultValue: true,
        group: 'Show promo elements',
      },
    ),
    showImage: PropTypes.bool.tag(
      {
        label: 'Show image',
        defaultValue: true,
        group: 'Show promo elements',
      },
    ),
    showDescription: PropTypes.bool.tag(
      {
        label: 'Show description',
        defaultValue: true,
        group: 'Show promo elements',
      },
    ),
    showByline: PropTypes.bool.tag(
      {
        label: 'Show byline',
        defaultValue: true,
        group: 'Show promo elements',
      },
    ),
    showDate: PropTypes.bool.tag(
      {
        label: 'Show date',
        defaultValue: true,
        group: 'Show promo elements',
      },
    ),
    lazyLoad: PropTypes.bool.tag({
      name: 'Lazy Load block?',
      defaultValue: false,
      description: 'Turning on lazy-loading will prevent this block from being loaded on the page until it is nearly in-view for the user.',
    }),
  }),
};

export default ResultsList;
