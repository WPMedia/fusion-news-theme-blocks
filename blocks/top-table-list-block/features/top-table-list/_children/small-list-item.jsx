import React, { useContext } from 'react';
import { PromoHeadline, PromoImage } from '@wpmedia/shared-styles';
import styled, { ThemeContext } from 'styled-components';
import {
  LEFT, RIGHT, ABOVE, BELOW,
} from '../shared/imagePositionConstants';

const Article = styled.article`
display: flex;
grid-gap: 2rem;

&.horizontal.reverse {
  flex-direction: row-reverse;
}

&.vertical.reverse {
  flex-direction: column-reverse;
}

.promo-headline {
  flex: 2;
}

.promo-image {
  flex: 1;
}
`;

const Headline = styled(PromoHeadline)`
  overflow: hidden;
  display: box;
  box-orient: vertical;
  -webkit-line-clamp: 3;
  -moz-box-oriented: vertical;
  text-overflow: -o-ellipsis-lastline;
`;

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
  const themeContext = useContext(ThemeContext);
  const storiesPerRow = (typeof storiesPerRowSM === 'undefined') ? 2 : storiesPerRowSM;
  const showImage = showImageSM;
  const layout = imagePosition === ABOVE || imagePosition === BELOW ? 'vertical' : 'horizontal';
  const isReverseLayout = (imagePosition === ABOVE || imagePosition === LEFT);
  const showBottomBorder = (typeof showBottomBorderSM === 'undefined') ? true : showBottomBorderSM;

  const colClassNum = (!!storiesPerRow && Math.floor(12 / storiesPerRow)) || 1;
  const colClasses = `col-sm-12 col-md-${colClassNum} col-lg-${colClassNum} col-xl-${colClassNum}`;

  return (
    <>
      <Article key={id} className={`promo-container ${layout} ${isReverseLayout ? 'reverse' : ''} sm-promo-padding-btm`}>
        {showHeadlineSM ? (
          <Headline
            styles={themeContext?.smallPromo?.heading}
            content={element}
            className="headline-wrap col-lg-xl-8"
            linkClassName="sm-promo-headline"
            headingClassName="sm-promo-headline"
            editable={false}
          />
        ) : null}
        { showImage ? (
          <PromoImage
            className="col-md-xl-4"
            content={element}
            showPromoLabel
            promoSize="SM"
            imageRatio={imageRatioSM}
            editable={false}
          />
        ) : null }
      </Article>
      <hr className={!showBottomBorder ? 'hr-borderless' : ''} />
    </>
  );
};
export default SmallListItem;
