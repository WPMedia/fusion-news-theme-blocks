import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useFusionContext } from 'fusion:context';
import { useEditableContent } from 'fusion:content';
import getProperties from 'fusion:properties';
import getTranslatedPhrases from 'fusion:intl';
import { formatURL } from '@wpmedia/engine-theme-sdk';
import styled, { ThemeContext } from 'styled-components';

import ThemeStyles from '../theme-styles';

// const OverlineElement = styled.span`
//   display: inline-block;
//   text-decoration: none;

//   background-color: ${(props) => props.theme.backgroundColor};
//   color: ${(props) => props.theme.color};
//   font-size: ${(props) => props.theme.fontSize};
//   font-weight: ${(props) => props.theme.fontWeight};
//   padding: ${(props) => props.theme.padding};
// `;

const StyledOverlineElement = styled(ThemeStyles)`
  display: inline-block;
  text-decoration: none;
`;

const Overline = (props) => {
  const themeContext = useContext(ThemeContext);
  const { globalContent, arcSite } = useFusionContext();
  const { editableContent } = useEditableContent();
  const phrases = getTranslatedPhrases(getProperties(arcSite).locale || 'en');
  const {
    customText,
    customUrl,
    editable,
    story,
    className = '',
    styles,
  } = props;

  const sourceContent = story || globalContent || {};

  const {
    display: labelDisplay,
    url: labelUrl,
    text: labelText,
  } = (sourceContent.label && sourceContent.label.basic) || {};
  const shouldUseLabel = !!(labelDisplay);

  const {
    _id: sectionUrl,
    name: sectionText,
  } = (sourceContent.websites
    && sourceContent.websites[arcSite]
    && sourceContent.websites[arcSite].website_section) || {};

  const shouldUseProps = !!(customText || customUrl);
  const editableContentPath = shouldUseLabel ? 'headlines.basic' : `websites.${arcSite}.website_section.name`;

  // Default to websites object data
  let [text, url] = [sectionText, sectionUrl];

  if (sourceContent?.owner?.sponsored) {
    text = sourceContent?.label?.basic?.text || phrases.t('overline.sponsored-content');
    url = null;
  } else if (shouldUseProps) {
    text = customText;
    url = customUrl;
  } else if (shouldUseLabel) {
    [text, url] = [labelText, labelUrl];
  }

  let edit = {};
  if (editable) {
    if (sourceContent._id) {
      edit = { ...editableContent(sourceContent, editableContentPath) };
    }
  }

  const classNames = ['overline'];
  const itemProps = {
    ...edit,
    theme: {
      ...themeContext.overline,
      ...styles,
    },
    as: 'span',
  };

  if (url) {
    itemProps.href = formatURL(url);
    itemProps.as = 'a';
    classNames.push('overline--link');
  }

  if (className) {
    classNames.push(className);
  }

  itemProps.className = classNames.join(' ');

  return (url || text) ? (
    <StyledOverlineElement {...itemProps}>
      {text}
    </StyledOverlineElement>
  ) : null;
};

Overline.label = 'Overline – Arc Block';

Overline.propTypes = {
  customText: PropTypes.string,
  customUrl: PropTypes.string,
};

export default Overline;
