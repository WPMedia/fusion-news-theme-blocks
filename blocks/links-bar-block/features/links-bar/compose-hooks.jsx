/*
  This should be moved to a more global location to allow easier
  resuse across blocks
*/
import React from 'react';

const composeHooks = (hooks) => (Component) => {
  if (!Component) {
    throw new Error('Component must be provided to compose');
  }

  if (!hooks) {
    return Component;
  }

  return (props) => {
    const hooksObject = typeof hooks === 'function' ? hooks(props) : hooks;

    const hooksProps = {};

    Object.entries(hooksObject).forEach((hook) => {
      const hookName = hook[0];
      const hookValue = hook[1]();

      hooksProps[hookName] = hookValue;
    });

    return <Component {...hooksProps} {...props} />;
  };
};

export default composeHooks;
