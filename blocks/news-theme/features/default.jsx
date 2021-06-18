import React from 'react';
import { useContent } from 'fusion:content';
import { ThemeProvider, createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
html {
  box-sizing: border-box;
  font-size: 16px;
}

* {
  box-sizing: inherit;

  &::before,
  &::after {
    box-sizing: inherit;
  }
}

body,
h1,
h2,
h3,
h4,
h5,
h6,
p,
ol,
ul {
  font-weight: normal;
  margin: 0;
  padding: 0;
}

html,
body {
  height: 100%;
  width: 100%;
}

ol,
ul {
  list-style: none;
}

img {
  height: auto;
  max-width: 100%;
}

a {
  color: inherit;
}

body {
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.color};
  font-family: ${(props) => props.theme.fontFamily};
  margin: 0;
  padding: 0;
}

p {
  font-size: ${(props) => props.theme.paragraph.fontSize};
  line-height: ${(props) => props.theme.paragraph.lineHeight};
}

.container {
  margin: 0 8%;
}

.row {
  display: grid;
  grid-auto-flow: dense;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 2rem;
}

.left-article-section {
  border-right: 1px solid #dadada;
  padding: 0 2rem 0 0;
}

.col-xl-12 {
  grid-column-start: span 12;
}

.col-sm-xl-12 {
  grid-column-start: span 12;
}

.col-lg-xl-8 {
  grid-column-start: span 8;
}

.col-lg-xl-4 {
  grid-column-start: span 4;
}

.col-md-xl-4 {
  grid-column-start: span 4;
}

.col-md-xl-6 {
  grid-column-start: span 6;
}
`;

const NewsTheme = ({ children }) => {
  const themeSettings = useContent({
    source: 'news-theme',
  });
  return (
    <ThemeProvider theme={themeSettings}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
};

export default NewsTheme;
