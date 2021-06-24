/* eslint-disable jsx-a11y/no-onchange */
import React from 'react';
// import { useFusionContext } from 'fusion:context';
import getCSSVariables from './utils/getCSSVariables';
import LowerFooter from './styles/LowerFooter';
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

      0: (2) ["--colors-primary", "deeppink"]
1: (2) ["--colors-background", "tan"]

limitation: named colors don't work in picker
*/

/*
    0: (2) ["--colors-primary", "deeppink"]
    1: (2) ["--colors-background", "tan"]

  */
const ThemeStyle = () => {
  const cssCustomPropIndex = getCSSVariables();
  const [targetPropertyIndex, setPropertyIndex] = React.useState(0);
  const targetProperty = cssCustomPropIndex[targetPropertyIndex][0];
  const targetPropertyValue = cssCustomPropIndex[targetPropertyIndex][1];

  function handleSetPropertyValue(event) {
    const { value: pickedPropertyValue } = event.target;
    document.documentElement.style.setProperty(
      targetProperty,
      pickedPropertyValue,
    );
  }

  function handleSetProperty(event) {
    const { value: pickedPropertyIndex } = event.target;
    setPropertyIndex(parseInt(pickedPropertyIndex, 10));
  }

  return (
    <LowerFooter>
      <label htmlFor="property-picker">
        Pick Target CSS Variable
        <select
          id="property-picker"
          onChange={handleSetProperty}
          value={targetPropertyIndex}
        >
          {
          cssCustomPropIndex.map((customPropArray, index) => {
            const [propertyName] = customPropArray;
            return (
              <option value={index}>{propertyName}</option>
            );
          })
        }
        </select>
      </label>

      <label htmlFor="themes-property-picker">
        <input
          id="themes-property-picker"
          type="color"
          value={targetPropertyValue}
          onChange={handleSetPropertyValue}
        />
      </label>
    </LowerFooter>
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
