import React from 'react';
import PropTypes from 'prop-types';

import { useFusionContext } from 'fusion:context';
import getTranslatedPhrases from 'fusion:intl';
import getProperties from 'fusion:properties';

import { isServerSide, LazyLoad } from '@wpmedia/engine-theme-sdk';
import { HeadingSection } from '@wpmedia/shared-styles';

// shared with search results list
// to modify, go to the shared styles block
import '@wpmedia/shared-styles/scss/_results-list.scss';
import '@wpmedia/shared-styles/scss/_results-list-desktop.scss';
import '@wpmedia/shared-styles/scss/_results-list-mobile.scss';

import { resolveDefaultPromoElements } from './results/helpers';
import Results from './results';

const ResultsList = ({ customFields }) => {
  const {
    arcSite,
    contextPath,
    deployment,
    isAdmin,
  } = useFusionContext();
  const {
    lazyLoad,
    listContentConfig: {
      contentService,
      contentConfigValues,
    },
  } = customFields;
  const {
    fallbackImage,
    locale,
    primaryLogoAlt,
    breakpoints,
    resizerURL,
  } = getProperties(arcSite);
  const imageProperties = {
    smallWidth: 158,
    smallHeight: 89,
    mediumWidth: 274,
    mediumHeight: 154,
    largeWidth: 274,
    largeHeight: 154,
    primaryLogoAlt,
    breakpoints,
    resizerURL,
  };
  const targetFallbackImage = !(fallbackImage.includes('http'))
    ? deployment(`${contextPath}/${fallbackImage}`)
    : fallbackImage;
  const promoElements = resolveDefaultPromoElements(customFields);
  const phrases = getTranslatedPhrases(locale || 'en');
  const isServerSideLazy = lazyLoad && isServerSide() && !isAdmin;
  const configuredOffset = parseInt(contentConfigValues?.offset, 10)
    || parseInt(contentConfigValues?.feedOffset, 10)
    || parseInt(contentConfigValues?.from, 10)
    || 0;
  const configuredSize = parseInt(contentConfigValues?.size, 10)
    || parseInt(contentConfigValues?.feedSize, 10)
    || 10;

  return (
    <LazyLoad enabled={lazyLoad && !isAdmin}>
      <HeadingSection>
        <Results
          arcSite={arcSite}
          configuredOffset={configuredOffset}
          configuredSize={configuredSize}
          contentConfigValues={contentConfigValues}
          contentService={contentService}
          imageProperties={imageProperties}
          isServerSideLazy={isServerSideLazy}
          phrases={phrases}
          showByline={promoElements.showByline}
          showDate={promoElements.showDate}
          showDescription={promoElements.showDescription}
          showHeadline={promoElements.showHeadline}
          showImage={promoElements.showImage}
          targetFallbackImage={targetFallbackImage}
        />
      </HeadingSection>
    </LazyLoad>
  );
};

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
