import React from 'react';
import { withKnobs, text } from '@storybook/addon-knobs';
import LinkBar from './features/links-bar/link-bar';

export default {
  title: 'Link Bar Block',
  decorators: [withKnobs],
};

const fusionContext = { arcSite: 'abc' };

export const twoLinks = () => {
  const content = {
    children: [
      {
        _id: 123,
        node_type: 'link',
        url: 'http://google.com',
        display_name: text('Link 1', 'Link Text'),
      },
      {
        _id: 123,
        node_type: 'link',
        url: 'http://google.com',
        display_name: text('Link 2', 'Link Text'),
      },
    ],
  };

  return (
    <LinkBar useContent={content} useFusionContext={fusionContext} />
  );
};
