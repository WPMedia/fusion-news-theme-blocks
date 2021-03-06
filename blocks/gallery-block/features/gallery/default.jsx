import React from 'react';
import PropTypes from 'prop-types';
import { useContent } from 'fusion:content';
import { useFusionContext, useAppContext } from 'fusion:context';
import getProperties from 'fusion:properties';
import getTranslatedPhrases from 'fusion:intl';

import { Gallery, LazyLoad, isServerSide } from '@wpmedia/engine-theme-sdk';

const GalleryFeatureItem = (
  {
    customFields: {
      inheritGlobalContent,
      galleryContentConfig,
    } = {},
  },
) => {
  let AdBlock;

  try {
    const { default: AdFeature } = require('@wpmedia/ads-block');
    AdBlock = () => (
      <AdFeature customFields={{
        adType: '300x250_gallery',
        displayAdLabel: true,
      }}
      />
    );
  } catch (e) {
    AdBlock = () => <p>Ad block not found</p>;
  }

  const { arcSite } = useFusionContext();
  const { resizerURL, galleryCubeClicks, locale = 'en' } = getProperties(arcSite);
  const { globalContent = {} } = useAppContext();
  const phrases = getTranslatedPhrases(locale);
  const content = useContent(galleryContentConfig ? {
    source: galleryContentConfig.contentService,
    query: galleryContentConfig.contentConfigValues,
  } : {});

  const showGlobalContent = (typeof inheritGlobalContent === 'undefined') ? (typeof galleryContentConfig === 'undefined') : inheritGlobalContent;
  const {
    content_elements: contentElements = [],
    headlines = {},
    id = '',
  } = showGlobalContent ? globalContent : content;

  const interstitialClicks = parseInt(galleryCubeClicks, 10);

  // When we have all translated languages we can uncomment this line and
  // the Gallery property autoplayPhraseLabels
  // const autoplayPhraseLabels = {
  //   start: this.phrases.t('global.gallery-autoplay-label-start'),
  //   stop: this.phrases.t('global.gallery-autoplay-label-stop'),
  // };

  return (
    <Gallery
      galleryElements={contentElements}
      resizerURL={resizerURL}
      ansId={id}
      ansHeadline={headlines?.basic ? headlines.basic : ''}
      expandPhrase={phrases.t('global.gallery-expand-button')}
      // autoplayPhraseLabels={autoplayPhraseLabels}
      autoplayPhrase={phrases.t('global.gallery-autoplay-button')}
      pausePhrase={phrases.t('global.gallery-pause-autoplay-button')}
      pageCountPhrase={/* istanbul ignore next */ (current, total) => phrases.t('global.gallery-page-count-text', { current, total })}
      adElement={/* istanbul ignore next */ () => (<AdBlock />)}
      interstitialClicks={interstitialClicks}
    />
  );
};

const GalleryFeature = ({ customFields = {} }) => {
  const { isAdmin } = useFusionContext();
  if (customFields.lazyLoad && isServerSide() && !isAdmin) { // On Server
    return null;
  }
  return (
    <LazyLoad enabled={customFields.lazyLoad && !isAdmin}>
      <GalleryFeatureItem customFields={{ ...customFields }} />
    </LazyLoad>
  );
};

GalleryFeature.propTypes = {
  customFields: PropTypes.shape({
    galleryContentConfig: PropTypes.contentConfig().tag({
      group: 'Configure Content',
      label: 'Display Content Info',
    }),
    inheritGlobalContent: PropTypes.bool.tag({
      group: 'Configure Content',
      defaultValue: true,
    }),
    lazyLoad: PropTypes.bool.tag({
      name: 'Lazy Load block?',
      defaultValue: false,
      description: 'Turning on lazy-loading will prevent this block from being loaded on the page until it is nearly in-view for the user.',
    }),
  }),
};

GalleryFeature.label = 'Gallery – Arc Block';

export default GalleryFeature;
