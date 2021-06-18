import React, { Component } from 'react';
import { localizeDateTime } from '@wpmedia/engine-theme-sdk';
import Consumer from 'fusion:consumer';
import getProperties from 'fusion:properties';
// import './date.scss';
import { PrimaryFont } from '@wpmedia/shared-styles';

@Consumer
class ArticleDate extends Component {
  constructor(props) {
    super(props);

    // Inherit global content
    const {
      globalContent: {
        display_date: globalDateString,
      } = {},
      date,
    } = this.props;
    // Set dateString to date from globalContent
    // if it exists and date prop has not been passed to it
    // If it has a date prop then set dateString to the
    // date recieved from prop instead of the date from globalContent
    const dateString = date || globalDateString;

    const { arcSite } = this.props;
    const {
      dateLocalization: { language, timeZone, dateTimeFormat } = { language: 'en', timeZone: 'GMT', dateFormat: 'LLLL d, yyyy \'at\' K:m bbbb z' },
    } = getProperties(arcSite);
    const displayDate = (dateString && Date.parse(dateString)) ? localizeDateTime(new Date(dateString), dateTimeFormat, language, timeZone) : '';
    this.state = { displayDate };
  }

  render() {
    const { displayDate } = this.state;
    const { classNames } = this.props;
    return (
      <PrimaryFont as="time" key={displayDate} className={`date ${classNames}`} dateTime={displayDate}>
        {displayDate}
      </PrimaryFont>
    );
  }
}

ArticleDate.label = 'Date – Arc Block';

export default ArticleDate;
