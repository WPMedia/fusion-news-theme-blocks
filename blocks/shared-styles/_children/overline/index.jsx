import React from 'react';
import { useFusionContext } from 'fusion:context';
import getProperties from 'fusion:properties';
import getTranslatedPhrases from 'fusion:intl';
import { Overline as OverlineOutput } from '@wpmedia/engine-theme-sdk';

import './overline.scss';

const Overline = (props) => {
  const { arcSite } = useFusionContext();
  const phrases = getTranslatedPhrases(getProperties(arcSite).locale || 'en');

  const overlineProps = {
    ...props,
    translations: {
      sponsoredContent: phrases.t('overline.sponsored-content'),
    },
  };

  return <OverlineOutput {...overlineProps} />;
};

export default Overline;
