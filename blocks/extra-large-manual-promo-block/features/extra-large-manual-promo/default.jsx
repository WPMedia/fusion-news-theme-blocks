import React from 'react';
import PropTypes from '@arc-fusion/prop-types';
import { useFusionContext } from 'fusion:context';
import { useEditableContent } from 'fusion:content';
import { LazyLoad, isServerSide } from '@wpmedia/engine-theme-sdk';
import { imageRatioCustomField } from '@wpmedia/resizer-image-block';
import {
  Overline, PromoDescription, PromoHeadline, PromoImage,
} from '@wpmedia/shared-styles';

// import '@wpmedia/shared-styles/scss/_extra-large-promo.scss';

const ExtraLargeManualPromoItem = ({ customFields }) => {
  const { isAdmin } = useFusionContext();
  const { searchableField } = useEditableContent();

  return (
    <>
      <article className="container-fluid xl-large-promo xl-large-manual-promo">
        <div className="row">
          {(customFields?.showOverline
            || customFields?.showHeadline
            || customFields?.showImage
            || customFields?.showDescription)
          && (
            <div className="col-sm-xl-12 flex-col" style={{ position: isAdmin ? 'relative' : null }}>
              {customFields?.showOverline
                ? (
                  <Overline
                    customText={customFields?.overline}
                    customUrl={customFields?.overlineURL}
                  />
                )
                : null}
              {customFields?.showHeadline
                ? (
                  <PromoHeadline
                    link={customFields?.linkURL}
                    text={customFields?.headline}
                    newTab={customFields?.newTab}
                    headingClassName="xl-promo-headline"
                    linkClassName="xl-promo-headline"
                  />
                )
                : null}
              {customFields?.showImage
                ? (
                  <div {...searchableField('imageOverrideURL')}>
                    <PromoImage
                      {...customFields}
                      customImageURL={customFields?.imageURL}
                      alt={customFields?.headline}
                      promoSize="XL"
                    />
                  </div>
)
                : null}
              {customFields?.showDescription
                ? (
                  <PromoDescription
                    className="description-text"
                    text={customFields?.description}
                  />
                )
                : null}
            </div>
          )}
        </div>
      </article>
      <hr />
    </>
  );
};

const ExtraLargeManualPromo = ({ customFields }) => {
  const { isAdmin } = useFusionContext();
  if (customFields?.lazyLoad && isServerSide() && !isAdmin) { // On Server
    return null;
  }
  return (
    <LazyLoad enabled={customFields?.lazyLoad && !isAdmin}>
      <ExtraLargeManualPromoItem customFields={{ ...customFields }} />
    </LazyLoad>
  );
};

ExtraLargeManualPromo.propTypes = {
  customFields: PropTypes.shape({
    headline: PropTypes.string.tag({
      label: 'Headline',
      group: 'Configure Content',
    }),
    description: PropTypes.string.tag({
      label: 'Description',
      group: 'Configure Content',
    }),
    overline: PropTypes.string.tag({
      label: 'Overline',
      group: 'Configure Content',
    }),
    overlineURL: PropTypes.string.tag({
      label: 'Overline URL',
      group: 'Configure Content',
    }),
    imageURL: PropTypes.string.tag({
      label: 'Image URL',
      group: 'Configure Content',
      searchable: 'image',
    }),
    linkURL: PropTypes.string.tag({
      label: 'Link URL',
      group: 'Configure Content',
    }),
    newTab: PropTypes.bool.tag({
      label: 'Open in new tab',
      defaultValue: false,
      group: 'Configure Content',
    }),
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
    ...imageRatioCustomField('imageRatio', 'Art', '4:3'),
    lazyLoad: PropTypes.bool.tag({
      name: 'Lazy Load block?',
      defaultValue: false,
      description: 'Turning on lazy-loading will prevent this block from being loaded on the page until it is nearly in-view for the user.',
    }),
  }),
};

ExtraLargeManualPromo.label = 'Extra Large Manual Promo – Arc Block';

export default ExtraLargeManualPromo;
