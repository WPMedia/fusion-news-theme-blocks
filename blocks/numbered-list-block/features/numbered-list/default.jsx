/* eslint-disable camelcase */
import PropTypes from 'prop-types';
import Consumer from 'fusion:consumer';
import React, { Component } from 'react';
import getProperties from 'fusion:properties';

import {
  Image, LazyLoad, isServerSide, ThemeStyle,
} from '@wpmedia/engine-theme-sdk';
import './numbered-list.scss';
import { extractResizedParams } from '@wpmedia/resizer-image-block';

function extractImage(promo) {
  return promo && promo.basic && promo.basic.type === 'image' && promo.basic.url;
}

@Consumer
class NumberedList extends Component {
  constructor(props) {
    super(props);
    const { lazyLoad = false } = props.customFields || {};

    this.arcSite = props.arcSite;
    this.lazyLoad = lazyLoad;
    this.isAdmin = props.isAdmin;

    this.state = {
      placeholderResizedImageOptions: {},
    };

    this.fetchPlaceholder();

    // Fetch stories if lazyLoad is not enabled, the code is running on the server
    if (!this.lazyLoad && isServerSide()) {
      this.fetchStories();
    }
  }

  componentDidMount() {
    this.fetchStories();
  }

  getFallbackImageURL() {
    const { arcSite, deployment, contextPath } = this.props;
    let targetFallbackImage = getProperties(arcSite).fallbackImage;

    if (!targetFallbackImage.includes('http')) {
      targetFallbackImage = deployment(`${contextPath}/${targetFallbackImage}`);
    }

    return targetFallbackImage;
  }

  fetchStories() {
    const { customFields: { listContentConfig, showImage } } = this.props;
    const { contentService, contentConfigValues } = listContentConfig;
    this.fetchContent({
      resultList: {
        source: contentService,
        query: { ...contentConfigValues, feature: 'numbered-list' },
        filter: `{
          content_elements {
            _id,
            headlines {
              basic
            }
            ${showImage ? `promo_items {
              basic {
                type
                url
                resized_params {
                  274x183
                  105x70
                }
              }
            }` : null}
            websites {
              ${this.arcSite} {
                website_url
              }
            }
          }
        }`,
      },
    });
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

  render() {
    if (this.lazyLoad && isServerSide() && !this.isAdmin) {
      return null;
    }

    const {
      customFields: {
        showHeadline = true,
        showImage = true,
        title = '',
      },
      arcSite,
    } = this.props;
    const {
      resultList: { content_elements: contentElements = [] } = {},
      placeholderResizedImageOptions,
    } = this.state;

    const targetFallbackImage = this.getFallbackImageURL();

    const ListResults = () => (
      <div className="numbered-list-container layout-section">
        {(title !== '' && contentElements && contentElements.length) ? (
          <ThemeStyle as="h2" className="list-title">
            {title}
          </ThemeStyle>
        ) : null }
        {(contentElements && contentElements.length) ? contentElements.map((element, i) => {
          const {
            headlines: { basic: headlineText } = {},
            promo_items: promoItems,
            websites,
          } = element;

          if (!websites[arcSite]) {
            return null;
          }
          const url = websites[arcSite].website_url;

          return (
            <React.Fragment key={`numbered-list-${url}`}>
              <div className="numbered-list-item numbered-item-margins">
                {showHeadline
                && (
                <a href={url} className="headline-list-anchor">
                  <ThemeStyle as="p" className="list-item-number">{i + 1}</ThemeStyle>
                  <ThemeStyle as="h2" className="headline-text">{headlineText}</ThemeStyle>
                </a>
                )}
                {showImage
                && (
                <a
                  href={url}
                  className="list-anchor-image vertical-align-image"
                  aria-hidden="true"
                  tabIndex="-1"
                >
                  {extractImage(promoItems) ? (
                    <Image
                      resizedImageOptions={extractResizedParams(element)}
                      url={extractImage(promoItems)}
                      alt={headlineText}
                      // small, including numbered list, is 3:2 aspect ratio
                      smallWidth={105}
                      smallHeight={70}
                      mediumWidth={105}
                      mediumHeight={70}
                      largeWidth={274}
                      largeHeight={183}
                      breakpoints={getProperties(arcSite)?.breakpoints}
                      resizerURL={getProperties(arcSite)?.resizerURL}
                    />
                  ) : (
                    <Image
                      smallWidth={105}
                      smallHeight={70}
                      mediumWidth={105}
                      mediumHeight={70}
                      largeWidth={274}
                      largeHeight={183}
                      alt={getProperties(arcSite).primaryLogoAlt || ''}
                      url={targetFallbackImage}
                      breakpoints={getProperties(arcSite)?.breakpoints}
                      resizedImageOptions={placeholderResizedImageOptions}
                      resizerURL={getProperties(arcSite)?.resizerURL}
                    />
                  )}
                </a>
                )}
              </div>
              <hr />
            </React.Fragment>
          );
        }) : null}
      </div>
    );

    return (
      <LazyLoad enabled={this.lazyLoad && !this.isAdmin}>
        <ListResults />
      </LazyLoad>
    );
  }
}

NumberedList.propTypes = {
  customFields: PropTypes.shape({
    listContentConfig: PropTypes.contentConfig('ans-feed').tag(
      {
        group: 'Configure Content',
        label: 'Display Content Info',
      },
    ),
    title: PropTypes.string.tag({ label: 'Title' }),
    showHeadline: PropTypes.bool.tag({
      label: 'Show headline',
      defaultValue: true,
      group: 'Show promo elements',
    }),
    showImage: PropTypes.bool.tag({
      label: 'Show image',
      defaultValue: true,
      group: 'Show promo elements',
    }),
    lazyLoad: PropTypes.bool.tag({
      name: 'Lazy Load block?',
      defaultValue: false,
      description: 'Turning on lazy-loading will prevent this block from being loaded on the page until it is nearly in-view for the user.',
    }),
  }),
};

NumberedList.label = 'Numbered List – Arc Block';

export default NumberedList;
