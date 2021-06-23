import React from 'react';
import { PromoHeadline, PromoImage } from '@wpmedia/shared-styles';
import {
  LEFT, RIGHT, ABOVE, BELOW,
} from '../shared/imagePositionConstants';

const SmallListItem = (props) => {
  const {
    id,
    element,
    customFields: {
      imagePositionSM: imagePosition = RIGHT,
      storiesPerRowSM,
      showHeadlineSM,
      showImageSM,
      showBottomBorderSM,
      imageRatioSM,
    },
  } = props;

  const storiesPerRow = (typeof storiesPerRowSM === 'undefined') ? 2 : storiesPerRowSM;
  const showImage = showImageSM;
  const layout = imagePosition === ABOVE || imagePosition === BELOW ? 'vertical' : 'horizontal';
  const isReverseLayout = (imagePosition === ABOVE || imagePosition === LEFT);
  const showBottomBorder = (typeof showBottomBorderSM === 'undefined') ? true : showBottomBorderSM;

  const colClassNum = (!!storiesPerRow && Math.floor(12 / storiesPerRow)) || 1;
  const colClasses = `col-sm-12 col-md-${colClassNum} col-lg-${colClassNum} col-xl-${colClassNum}`;

  return (
    <article
      key={id}
      className={`top-table-list-small-promo small-promo ${colClasses}`}
    >
      <div className={`promo-container row ${layout} ${isReverseLayout ? 'reverse' : ''} sm-promo-padding-btm`}>
        {showHeadlineSM ? (
          <PromoHeadline
            content={element}
            linkClassName="sm-promo-headline"
            headingClassName="sm-promo-headline"
            editable={false}
          />
        ) : null}
        { showImage ? (
          <PromoImage
            content={element}
            showPromoLabel
            promoSize="SM"
            imageRatio={imageRatioSM}
            editable={false}
          />
        ) : null }
      </div>
      <hr className={!showBottomBorder ? 'hr-borderless' : ''} />
    </article>
  );
};
export default SmallListItem;
