import React from 'react';
import Consumer from 'fusion:consumer';
import getProperties from 'fusion:properties';
import { useFusionContext } from 'fusion:context';
import { resizerURL } from 'fusion:environment';
import { Image } from '@wpmedia/engine-theme-sdk';

@Consumer
class PlaceholderImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { resizedImageOptions: {} };
    this.fetch = this.fetch.bind(this);
    this.fetch();
  }

  fetch() {
    const { arcSite, deployment, contextPath } = useFusionContext();
    let targetFallbackImage = getProperties(arcSite).fallbackImage;

    // if true then it's a local image
    // else it's a url image that can be served
    if (targetFallbackImage && !(targetFallbackImage.includes('http'))) {
      targetFallbackImage = deployment(`${contextPath}/${targetFallbackImage}`);
    }

    const { resizedImageOptions } = this.state;
    this.fetchContent({
      resizedImageOptions: {
        source: 'resize-image-api',
        query: { raw_image_url: targetFallbackImage, respect_aspect_ratio: true },
        transform(newResizedImageOptions) {
          // console.log(newResizedImageOptions, 'new resized options');
          // Check if data is being returned
          if (newResizedImageOptions) return { ...resizedImageOptions, ...newResizedImageOptions };

          // Otherwise just keep the current image options
          return resizedImageOptions;
        },
      },
    });
  }

  render() {
    const {
      arcSite,
      smallWidth,
      smallHeight,
      mediumWidth,
      mediumHeight,
      largeWidth,
      largeHeight,
    } = this.props;
    const { resizedImageOptions } = this.state;

    return (
      <>
        <Image
          url={getProperties(arcSite).fallbackImage}
          alt={getProperties(arcSite).primaryLogoAlt || 'Placeholder logo'}
          // first element is always bigger
          smallWidth={smallWidth}
          smallHeight={smallHeight}
          mediumWidth={mediumWidth}
          mediumHeight={mediumHeight}
          largeWidth={largeWidth}
          largeHeight={largeHeight}
          resizedImageOptions={resizedImageOptions}
          resizerURL={resizerURL}
        />
      </>
    );
  }
}

PlaceholderImage.label = 'Placeholder Image – Arc Block';

export default PlaceholderImage;
