/* eslint-disable react/jsx-no-target-blank */
// Disabled eslint due to it not being able to handle the ternary logic
import React, { useContext } from 'react';
import { useEditableContent } from 'fusion:content';
import { useComponentContext, useFusionContext } from 'fusion:context';
import styled, { ThemeContext } from 'styled-components';

import ThemeStyles from '../theme-styles';

const StyledPromoHeadline = styled(ThemeStyles)`
  a {
    text-decoration: ${(props) => props.theme.textDecoration};
  }
`;

const PromoHeadline = (props) => {
  const {
    content = {},
    text,
    link,
    className = '',
    linkClassName = '',
    headingClassName = '',
    newTab = false,
    editable = true,
    styles,
  } = props;
  const themeContext = useContext(ThemeContext);
  const { editableContent } = useEditableContent();
  const { registerSuccessEvent } = useComponentContext();
  const { arcSite } = useFusionContext();

  const linkURL = content?.websites?.[arcSite]?.website_url || link;
  const linkText = content?.headlines?.basic || text;

  const editableItem = content?.headlines && editable ? editableContent(content, 'headlines.basic') : {};

  const theme = {
    ...themeContext.heading,
    ...styles,
  };

  return linkText ? (
    <div className={`promo-headline ${className}`}>
      <StyledPromoHeadline
        theme={theme}
        as="h2"
        className={headingClassName}
        {...editableItem}
        suppressContentEditableWarning
      >
        <a
          href={linkURL}
          target={newTab ? '_blank' : '_self'}
          rel={newTab ? 'noreferrer noopener' : ''}
          className={linkClassName}
          onClick={registerSuccessEvent}
        >
          {linkText}
        </a>
      </StyledPromoHeadline>
    </div>
  ) : null;
};

export default PromoHeadline;
