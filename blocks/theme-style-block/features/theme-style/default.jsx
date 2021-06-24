import React from 'react';
import styled from 'styled-components';
// import { useFusionContext } from 'fusion:context';

/*
Do it live

A block that takes in custom fields of arc sites and an ID.
Then gets the custom css properties on the page.
And you can adjust them and see it live.
I’m thinking a semi transparent sticky toolbar at the bottom of the page.
With options for which css variable and what kind of input it is, like color or size px.

Then the get property and values
and post to an endpoint
that saves the snapshot of css variables and the arc ID and sites

document.documentElement.style.setProperty(
  '--colors-primary',
  'red'
)

   document.getElementById('simple-list-block').style.setProperty(
    '--colors-primary',
        'red',
      );

*/

const ThemeLowerFooter = styled.div`
  position: fixed;
  /* on the editor this should be 50 */
  bottom: 25px;
  left: 0;
  right: 0;
  height: 100px;
  width: 90%;
  margin: 0 5%;
  /* generated via https://glassmorphism.com/ */
  background: rgba( 48, 50, 61, 0.55 );
  box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
  backdrop-filter: blur( 20.0px );
  -webkit-backdrop-filter: blur( 20.0px );
  border-radius: 10px;
  border: 1px solid rgba( 255, 255, 255, 0.18 );
`;

const ThemeStyle = () => {
/*
 Check if the stylesheet is internal or hosted on the current domain.
 If it isn't, attempting to access sheet.cssRules will throw a cross origin error.
 See https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet#Notes

 NOTE: One problem this could raise is hosting stylesheets on a CDN with a
 different domain. Those would be cross origin, so you can't access them.
*/
  const isSameDomain = (styleSheet) => {
  // Internal style blocks won't have an href value
    if (!styleSheet.href) {
      return true;
    }

    return styleSheet.href.indexOf(window.location.origin) === 0;
  };

  /*
 Determine if the given rule is a CSSStyleRule
 See: https://developer.mozilla.org/en-US/docs/Web/API/CSSRule#Type_constants
*/
  const isStyleRule = (rule) => rule.type === 1;

  /**
 * Get all custom properties on a page
 * @return array<array[string, string]>
 * ex; [["--color-accent", "#b9f500"], ["--color-text", "#252525"], ...]
 */
  // styleSheets is array-like, so we convert it to an array.
  // Filter out any stylesheets not on this domain
  const getCSSCustomPropIndex = () => [...document.styleSheets].filter(isSameDomain).reduce(
    (finalArr, sheet) => finalArr.concat(
      // cssRules is array-like, so we convert it to an array
      [...sheet.cssRules].filter(isStyleRule).reduce((propValArr, rule) => {
        const props = [...rule.style]
          .map((propName) => [
            propName.trim(),
            rule.style.getPropertyValue(propName).trim(),
          ])
        // Discard any props that don't start with "--". Custom props are required to.
          .filter(([propName]) => propName.indexOf('--') === 0);

        return [...propValArr, ...props];
      }, []),
    ),
    [],
  );

  const cssCustomPropIndex = getCSSCustomPropIndex();
  console.log(cssCustomPropIndex);

  return (
    <ThemeLowerFooter>
      <p>Theme Style</p>
      <label
        htmlFor="favcolor"
      >
        Select your favorite color:
      </label>
      <input
        type="color"
        id="favcolor"
        name="favcolor"
        value="#ff0000"
      />
    </ThemeLowerFooter>
  );
};

// todo: disable if clients don't want it shown on live pages

// const { isAdmin } = useFusionContext();

// only render if admin
// if (isAdmin) {
// (

// )
// }

// return null;
// ;

export default ThemeStyle;
