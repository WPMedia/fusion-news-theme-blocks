import React from 'react';
import styled from 'styled-components';
import getThemeStyle from 'fusion:themes';
import { useFusionContext } from 'fusion:context';

const SecondaryFontStyles = styled.div.attrs((props) => ({
  arcSite: props.arcSite,
}))`
  font-family: ${({ arcSite }) => getThemeStyle(arcSite)['secondary-font-family']};
  color: var(--colors-primary);
  background-color: var(--colors-background);
`;

const SecondaryFont = (props) => {
  const { arcSite } = useFusionContext();

  return (
    <SecondaryFontStyles {...props} arcSite={arcSite} />
  );
};

export default SecondaryFont;
