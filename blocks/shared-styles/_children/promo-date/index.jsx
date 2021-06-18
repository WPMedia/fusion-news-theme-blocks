import React from 'react';
import { useFusionContext } from 'fusion:context';
import getProperties from 'fusion:properties';
import { localizeDateTime } from '@wpmedia/engine-theme-sdk';
import PrimaryFont from '../primary-font';

// import './index.scss';

const PromoDate = (props) => {
  const {
    content = {},
    date,
    className = '',
  } = props;
  const { arcSite } = useFusionContext();
  const {
    dateLocalization: { language, timeZone, dateTimeFormat } = { language: 'en', timeZone: 'GMT', dateFormat: 'LLLL d, yyyy \'at\' K:m bbbb z' },
  } = getProperties(arcSite);

  const displayDate = content?.display_date || date;
  const formattedDate = (displayDate && Date.parse(displayDate)) ? localizeDateTime(new Date(displayDate), dateTimeFormat, language, timeZone) : '';

  return displayDate ? (
    <PrimaryFont
      as="time"
      className={`promo-date ${className}`}
      dateTime={formattedDate}
    >
      {formattedDate}
    </PrimaryFont>
  ) : null;
};

export default PromoDate;
