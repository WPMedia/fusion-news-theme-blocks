import React from 'react';
import styled from 'styled-components';
import getThemeStyle from 'fusion:themes';
import { useFusionContext } from 'fusion:context';

const PrimaryFontStyles = styled.div.attrs((props) => ({
  arcSite: props.arcSite,
  overrideColor: props.overrideColor,
}))`
  font-family: ${({ arcSite }) => getThemeStyle(arcSite)['primary-font-family']};
  background-color: var(--colors-background);
  color: var(--colors-primary);
`;

const PrimaryFont = (props) => {
  const { arcSite } = useFusionContext();

  return (
    <PrimaryFontStyles {...props} arcSite={arcSite} />
  );
};

export default PrimaryFont;
