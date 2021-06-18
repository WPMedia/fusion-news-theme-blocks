/* eslint-disable camelcase */
import PropTypes from 'prop-types';
import Consumer from 'fusion:consumer';
import React from 'react';
import ArticleDate from '@wpmedia/date-block';
import {
  Image, LazyLoad, isServerSide,
} from '@wpmedia/engine-theme-sdk';
import { extractResizedParams } from '@wpmedia/resizer-image-block';
import { Byline, Overline, PrimaryFont } from '@wpmedia/shared-styles';
import getProperties from 'fusion:properties';
import './card-list.scss';

function getResizedImage(promo) {
  if (promo?.basic?.type === 'image' && promo?.basic?.resized_params) {
    return promo.basic.resized_params;
  }

  if (promo?.lead_art?.promo_items) {
    return getResizedImage(promo.lead_art.promo_items);
  }

  return null;
}

function extractImage(promo) {
  if (promo?.basic?.type === 'image' && promo?.basic?.url) {
    return promo.basic.url;
  }

  if (promo?.lead_art?.promo_items) {
    return extractImage(promo.lead_art.promo_items);
  }

  return null;
}

@Consumer
class CardList extends React.Component {
  constructor(props) {
    super(props);
    const { lazyLoad = false } = props.customFields || {};

    this.arcSite = props.arcSite;
    this.lazyLoad = lazyLoad;
    this.isAdmin = props.isAdmin;

    this.siteProperties = getProperties(props.arcSite);

    this.largeImageOptions = {
      smallWidth: 377,
      smallHeight: 283,
      mediumWidth: 377,
      mediumHeight: 283,
      largeWidth: 377,
      largeHeight: 283,
      breakpoints: this.siteProperties?.breakpoints,
      resizerURL: this.siteProperties?.resizerURL,
    };

    this.samllImageOptions = {
      smallWidth: 105,
      smallHeight: 70,
      mediumWidth: 105,
      mediumHeight: 70,
      largeWidth: 274,
      largeHeight: 183,
      breakpoints: this.siteProperties?.breakpoints,
      resizerURL: this.siteProperties?.resizerURL,
    };

    this.state = {
      cardList: {},
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
    const { deployment, contextPath } = this.props;
    let targetFallbackImage = this.siteProperties.fallbackImage;

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

  fetchStories() {
    const { customFields: { listContentConfig } } = this.props;
    const { contentService, contentConfigValues } = listContentConfig;
    this.fetchContent({
      cardList: {
        source: contentService,
        query: { ...contentConfigValues, feature: 'card-list' },
        filter: `{
          content_elements {
            _id,
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
            owner {
              sponsored
            }
            promo_items {
              basic {
                type
                url
                resized_params {
                  377x283
                  274x183
                  105x70
                }
              }
              lead_art {
                promo_items {
                  basic {
                    type
                    url
                    resized_params {
                      377x283
                      274x183
                      105x70
                    }
                  }
                }
              }
            }
            websites {
              ${this.arcSite} {
                website_url
                website_section {
                  name
                }
              }
            }
          }
        }`,
      },
    });
  }

  render() {
    if (this.lazyLoad && isServerSide() && !this.isAdmin) {
      return null;
    }

    const { customFields: { title } = {}, arcSite } = this.props;
    const {
      cardList: { content_elements: pageContent = [] } = {},
      placeholderResizedImageOptions,
    } = this.state;

    const contentElements = pageContent.reduce((acc, element) => {
      if (element.websites?.[arcSite]) {
        return acc.concat(element);
      }
      return acc;
    }, []);

    const showSeparator = !!(
      contentElements[0]
      && contentElements[0].credits
      && contentElements[0].credits.by
      && contentElements[0].credits.by.length !== 0
    );
    const targetFallbackImage = this.getFallbackImageURL();

    const CardListItems = () => (
      (contentElements.length > 0
        && (
          <div className="card-list-container">
            <div className="simple-results-list-container">
              {
                title
                  ? (
                    <PrimaryFont
                      as="div"
                      className="card-list-title"
                    >
                      {title}
                    </PrimaryFont>
                  )
                  : ''
              }
              <article
                className="list-item-simple"
                key={`card-list-${contentElements[0].websites[arcSite].website_url}`}
              >
                <a
                  href={contentElements[0].websites[arcSite].website_url}
                  className="list-anchor card-list--link-container vertical-align-image"
                  aria-hidden="true"
                  tabIndex="-1"
                >
                  {
                   extractImage(contentElements[0].promo_items) ? (
                     <Image
                       url={extractImage(contentElements[0].promo_items)}
                       alt={contentElements[0].headlines.basic}
                       {...this.largeImageOptions}
                       resizedImageOptions={getResizedImage(contentElements[0].promo_items)}
                     />
                   ) : (
                     <Image
                       url={targetFallbackImage}
                       alt={this.siteProperties.primaryLogoAlt || ''}
                       {...this.largeImageOptions}
                       resizedImageOptions={placeholderResizedImageOptions}
                     />
                   )
                  }
                </a>
                { contentElements[0].websites[arcSite].website_section
                  && (<Overline story={contentElements[0]} className="card-list-overline" />
                  )}
                <div>
                  <PrimaryFont
                    as="h2"
                    className="card-list-headline"
                  >
                    <a
                      href={contentElements[0].websites[arcSite].website_url}
                      className="list-anchor vertical-align-image"
                      id="card-list--headline-link"
                    >
                      {contentElements[0].headlines.basic}
                    </a>
                  </PrimaryFont>
                  <div className="author-date">
                    <Byline content={contentElements[0]} list separator={showSeparator} font="Primary" />
                    <ArticleDate
                      classNames="story-date"
                      date={contentElements[0].display_date}
                    />
                  </div>
                </div>
              </article>
              {
                contentElements.slice(1).map((element) => {
                  const {
                    headlines: { basic: headlineText } = {},
                  } = element;
                  const url = element.websites[arcSite].website_url;
                  return (
                    <React.Fragment key={`card-list-${url}`}>
                      <hr />
                      <article
                        className="card-list-item card-list-item-margins"
                        key={`card-list-${url}`}
                        type="1"
                      >
                        <a
                          href={url}
                          className="headline-list-anchor vertical-align-image"
                        >
                          <PrimaryFont
                            as="h2"
                            className="headline-text"
                          >
                            {headlineText}
                          </PrimaryFont>
                        </a>
                        <a
                          href={url}
                          className="list-anchor-image vertical-align-image"
                          aria-hidden="true"
                          tabIndex="-1"
                        >
                          {
                            extractImage(element.promo_items)
                              ? (
                                <Image
                                  url={extractImage(element.promo_items)}
                                  alt={headlineText}
                                  {...this.samllImageOptions}
                                  resizedImageOptions={extractResizedParams(element)}
                                />
                              )
                              : (
                                <Image
                                  url={targetFallbackImage}
                                  alt={this.siteProperties.primaryLogoAlt || ''}
                                  {...this.samllImageOptions}
                                  resizedImageOptions={placeholderResizedImageOptions}
                                />
                              )
                          }
                        </a>
                      </article>
                    </React.Fragment>
                  );
                })
              }
            </div>
          </div>
        )
      )
    );

    return (
      <LazyLoad enabled={this.lazyLoad && !this.isAdmin}>
        <CardListItems />
      </LazyLoad>
    );
  }
}

CardList.label = 'Card List – Arc Block';

CardList.propTypes = {
  customFields: PropTypes.shape({
    listContentConfig: PropTypes.contentConfig('ans-feed').tag(
      {
        group: 'Configure Content',
        label: 'Display Content Info',
      },
    ),
    title: PropTypes.string,
    lazyLoad: PropTypes.bool.tag({
      name: 'Lazy Load block?',
      defaultValue: false,
      description: 'Turning on lazy-loading will prevent this block from being loaded on the page until it is nearly in-view for the user.',
    }),
  }),
};

export default CardList;
