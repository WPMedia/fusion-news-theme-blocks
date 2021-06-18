import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import {
  extractVideoEmbedFromStory,
  // presentational component does not do data fetching
  VideoPlayer as VideoPlayerPresentational,
  videoPlayerCustomFieldTags,
} from '@wpmedia/engine-theme-sdk';
import {
  Byline, Overline, PromoDate, PromoDescription, PromoHeadline, PromoImage, ThemeStyles,
} from '@wpmedia/shared-styles';


const StyledExtraLargePromo = styled(ThemeStyles)`
  display: inline-block;

  img {
    height: auto;
    width: 100%;
  }
`;

const VerticalOverlineImageStoryItem = (props) => {
  const {
    element,
    id,
    customFields = {},
  } = props;
  const themeContext = useContext(ThemeContext);

  const showBottomBorder = (typeof customFields?.showBottomBorderXL === 'undefined') || customFields?.showBottomBorderXL;

  const videoEmbed = customFields?.playVideoInPlaceXL
    && !!extractVideoEmbedFromStory
    && extractVideoEmbedFromStory(element);

  return (
    <>
      <StyledExtraLargePromo as="article" className="container-fluid xl-large-promo" key={id}>
        <div className="promo-item-margins row xl-promo-padding-bottom">
          {(customFields?.showHeadlineXL
            || !!videoEmbed
            || customFields?.showImageXL
            || customFields?.showDescriptionXL
            || customFields?.showBylineXL
            || customFields?.showDateXL)
          && (
            <div className="col-sm-xl-12 flex-col">
              {customFields?.showOverlineXL
                ? <Overline story={element} className="overline" editable />
                : null}
              {customFields?.showHeadlineXL
                ? (
                  <PromoHeadline
                    styles={themeContext?.extraLargePromo?.heading}
                    content={element}
                    headingClassName="xl-promo-headline"
                    linkClassName="xl-promo-headline"
                    editable={false}
                  />
                )
                : null}
              {(!!videoEmbed
                && (
                  <VideoPlayerPresentational
                    id={id}
                    embedMarkup={videoEmbed}
                    enableAutoplay={false}
                    shrinkToFit={customFields?.shrinkToFitXL}
                    viewportPercentage={customFields?.viewportPercentageXL}
                  />
                )
              ) || (
                customFields?.showImageXL
                && (
                  <PromoImage
                    content={element}
                    showPromoLabel
                    promoSize="XL"
                    promoLabelSize="large"
                    imageRatio={customFields?.imageRatioXL}
                  />
                )
              )}
              {customFields?.showDescriptionXL
                ? (
                  <PromoDescription
                    content={element}
                    className="description-text"
                    editable={false}
                  />
                )
                : null}
              <div className="article-meta">
                {customFields?.showBylineXL
                  ? <Byline content={element} font="Primary" list separator={customFields.showDateXL} />
                  : null}
                {customFields?.showDateXL
                  ? <PromoDate content={element} />
                  : null}
              </div>
            </div>
          )}
        </div>
      </StyledExtraLargePromo>
      <hr className={!showBottomBorder ? 'hr-borderless' : ''} />
    </>
  );
};

export const verticalOverlineImageStoryFields = (group) => ({
  shrinkToFitXL: videoPlayerCustomFieldTags.shrinkToFit.type.tag({
    ...(videoPlayerCustomFieldTags.shrinkToFit),
    group,
  }),
  viewportPercentageXL: videoPlayerCustomFieldTags.viewportPercentage.type.tag({
    ...(videoPlayerCustomFieldTags.viewportPercentage),
    group,
  }),
});

export default VerticalOverlineImageStoryItem;
