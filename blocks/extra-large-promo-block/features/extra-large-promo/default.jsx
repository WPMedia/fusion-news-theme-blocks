import React from 'react';
import PropTypes from 'prop-types';
import { useEditableContent, useContent } from 'fusion:content';

import { useFusionContext } from 'fusion:context';
import {
  Byline, Overline, PromoDate, PromoDescription, PromoHeadline, PromoImage, ThemeStyles,
} from '@wpmedia/shared-styles';
import {
  extractVideoEmbedFromStory,
  // presentational component does not do data fetching
  VideoPlayer as VideoPlayerPresentational,
  LazyLoad,
  isServerSide,
  videoPlayerCustomFields,
} from '@wpmedia/engine-theme-sdk';
import { imageRatioCustomField } from '@wpmedia/resizer-image-block';
import styled, { ThemeContext } from 'styled-components';

// import '@wpmedia/shared-styles/scss/_extra-large-promo.scss';

const StyledExtraLargePromo = styled(ThemeStyles)`
  display: inline-block;

  img {
    height: auto;
    width: 100%;
  }
`;

const ExtraLargePromoItem = ({ customFields }) => {
  const { arcSite, id, isAdmin } = useFusionContext();
  const { searchableField } = useEditableContent();

  const content = useContent({
    source: customFields?.itemContentConfig?.contentService ?? null,
    query: customFields?.itemContentConfig?.contentConfigValues
      ? {
        'arc-site': arcSite,
        feature: 'extra-large-promo',
        ...customFields.itemContentConfig.contentConfigValues,
      }
      : null,
    filter: `{
      _id
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
      description {
        basic
      }
      display_date
      type
      headlines {
        basic
      }
      label {
        basic {
          display
          url
          text
        }
      }
      owner {
        sponsored
      }
      promo_items {
        type
        url
        lead_art {
          embed_html
          type
          promo_items {
            basic {
              type
              url
              resized_params {
                800x600
                800x533
                800x450
                600x450
                600x400
                600x338
                400x300
                400x267
                400x225
              }
            }
          }
        }
        basic {
          type
          url
          resized_params {
            800x600
            800x533
            800x450
            600x450
            600x400
            600x338
            400x300
            400x267
            400x225
          }
        }
      }
      website_url
      embed_html
      websites {
        ${arcSite} {
          website_url
          website_section {
            _id
            name
          }
        }
      }
    }`,
  }) || null;

  const videoEmbed = (customFields?.playVideoInPlace && extractVideoEmbedFromStory(content));

  return (
    <>
      <StyledExtraLargePromo as="article" className="container-fluid xl-large-promo">
        <div className="row">
          {(customFields.showOverline
            || customFields?.showHeadline
            || !!videoEmbed
            || customFields?.showImage
            || customFields?.showDescription
            || customFields?.showByline
            || customFields?.showDate)
          && (
            <div className="col-sm-xl-12 flex-col" style={{ position: isAdmin ? 'relative' : null }}>
              {customFields.showOverline
                ? <Overline story={content} editable />
                : null}
              {customFields.showHeadline
                ? (
                  <PromoHeadline
                    content={content}
                    headingClassName="xl-promo-headline"
                    linkClassName="xl-promo-headline"
                  />
                )
                : null}
              {(!!videoEmbed
                && (
                  <VideoPlayerPresentational
                    id={id}
                    embedMarkup={videoEmbed}
                    enableAutoplay={false}
                    shrinkToFit={customFields?.shrinkToFit}
                    viewportPercentage={customFields?.viewportPercentage}
                  />
                )
              )
                || (
                  customFields?.showImage
                  && (
                    <div {...searchableField('imageOverrideURL')}>
                      <PromoImage
                        content={content}
                        customImageURL={customFields.imageOverrideURL}
                        showPromoLabel
                        promoSize="XL"
                        promoLabelSize="large"
                        imageRatio={customFields.imageRatio}
                        lazyLoad={customFields.lazyLoad}
                      />
                    </div>
                  )
                )}
              {customFields.showDescription
                ? (<PromoDescription className="description-text" content={content} />)
                : null}
              <div className="article-meta">
                {customFields.showByline
                  ? <Byline content={content} font="Primary" list separator={customFields.showDate} />
                  : null}
                {customFields.showDate
                  ? <PromoDate content={content} />
                  : null}
              </div>
            </div>
          )}
        </div>
      </StyledExtraLargePromo>
      <hr />
    </>
  );
};

const ExtraLargePromo = ({ customFields }) => {
  const { isAdmin } = useFusionContext();
  if (customFields.lazyLoad && isServerSide() && !isAdmin) { // On Server
    return null;
  }
  return (
    <LazyLoad enabled={customFields.lazyLoad && !isAdmin}>
      <ExtraLargePromoItem customFields={customFields} />
    </LazyLoad>
  );
};

ExtraLargePromo.propTypes = {
  customFields: PropTypes.shape({
    itemContentConfig: PropTypes.contentConfig('ans-item').tag(
      {
        group: 'Configure Content',
        label: 'Display Content Info',
      },
    ),
    showOverline: PropTypes.bool.tag(
      {
        label: 'Show overline',
        defaultValue: true,
        group: 'Show promo elements',
      },
    ),
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
    imageOverrideURL: PropTypes.string.tag({
      label: 'Image URL',
      group: 'Image',
      searchable: 'image',
    }),
    ...imageRatioCustomField('imageRatio', 'Art', '4:3'),
    playVideoInPlace: PropTypes.bool.tag({
      label: 'Play video in place',
      group: 'Art',
      defaultValue: false,
    }),
    lazyLoad: PropTypes.bool.tag({
      name: 'Lazy Load block?',
      defaultValue: false,
      description: 'Turning on lazy-loading will prevent this block from being loaded on the page until it is nearly in-view for the user.',
    }),
    ...(videoPlayerCustomFields()),
  }),
};

ExtraLargePromo.label = 'Extra Large Promo – Arc Block';

export default ExtraLargePromo;
