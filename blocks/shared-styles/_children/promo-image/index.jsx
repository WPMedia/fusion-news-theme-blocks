/* eslint-disable react/jsx-no-target-blank */
// Disabled eslint due to it not being able to handle the ternary logic
import React from 'react';
import { useComponentContext, useFusionContext } from 'fusion:context';
import { useContent } from 'fusion:content';
import getProperties from 'fusion:properties';
import { extractImageFromStory, extractResizedParams, ratiosFor } from '@wpmedia/resizer-image-block';
import { Image, isServerSide } from '@wpmedia/engine-theme-sdk';
import PlaceholderImage from '@wpmedia/placeholder-image-block';
import { PromoLabel } from '@wpmedia/shared-styles';
import discoverPromoType from './discover';

import './styles.scss';

/*
  This components has a useContent hook to fetch image meta data if a
  customImageURL is passed in.
  If in your paretn compout you are using the customImageURL prop to render
  a custom image make sure this component is not conditionally loaded anywhere
  in the render cycle.

  Fusion needs to run this component on the first server side pass to pick up
  the useContent hook to allow it to render server side.
*/

const PromoImage = ({
  content = {},
  customImageURL = null,
  alt = '',
  linkURL,
  newTab,
  promoSize,
  imageRatio,
  showPromoLabel = false,
  promoLabelSize = 'small',
  lazyLoad = false,
  className,
}) => {
  const { arcSite, isAdmin } = useFusionContext();
  const { registerSuccessEvent } = useComponentContext();
  const promoType = showPromoLabel ? discoverPromoType(content) : null;
  const ratios = ratiosFor(promoSize, imageRatio);

  let imageConfig = null;
  if (
    (customImageURL && lazyLoad)
    || (customImageURL && isAdmin)
    || (customImageURL && !isServerSide())) {
    imageConfig = 'resize-image-api-client';
  } else if (customImageURL) {
    imageConfig = 'resize-image-api';
  }

  const customFieldImageResizedImageOptions = useContent({
    source: imageConfig,
    query: { raw_image_url: customImageURL },
  });

  const imageURL = customImageURL || extractImageFromStory(content);
  const resizedImageOptions = customImageURL
    ? customFieldImageResizedImageOptions
    : extractResizedParams(content);

  const hasLink = () => content?.websites?.[arcSite]?.website_url || linkURL;

  const withLink = (item) => (
    <a
      href={content?.websites?.[arcSite]?.website_url || linkURL}
      target={newTab ? '_blank' : '_self'}
      rel={newTab ? 'noreferrer noopener' : ''}
      aria-hidden="true"
      tabIndex="-1"
      onClick={registerSuccessEvent}
    >
      {item}
    </a>
  );

  const ImageOrPlaceholder = imageURL && resizedImageOptions
    ? (
      <Image
        url={imageURL}
        alt={content && content.headlines ? content.headlines.basic : alt}
        {...ratios}
        breakpoints={getProperties(arcSite)?.breakpoints}
        resizerURL={getProperties(arcSite)?.resizerURL}
        resizedImageOptions={resizedImageOptions}
      />
    )
    : (
      <PlaceholderImage
        {...ratios}
        client={imageConfig === 'resize-image-api-client'}
      />
    );

  return (
    <div className={`promo-image ${className}`}>
      {hasLink() ? withLink(ImageOrPlaceholder) : ImageOrPlaceholder}
      {showPromoLabel && promoType ? <PromoLabel type={promoType} size={promoLabelSize} /> : null}
    </div>
  );
};

export default PromoImage;
