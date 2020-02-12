import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { useContent } from 'fusion:content';
import './simple-list.scss';

// components import start
// todo: remove this image and import bc base img tag
// import { Image } from '@arc-test-org/engine-theme-sdk';
import styled from 'styled-components';
import Consumer from 'fusion:consumer';
// components import end
import getThemeStyle from 'fusion:themes';

// helpers start
const getContentConfig = (propsObject) => {
  if ('customFields' in propsObject) {
    const { customFields } = propsObject;

    if ('listContentConfig' in customFields) {
      const { listContentConfig } = customFields;
      if ('contentService' in listContentConfig) {
        const { contentService, contentConfigValues } = listContentConfig;
        return {
          contentService, contentConfigValues,
        };
      }
    }
  }

  return {
    contentService: '',
    contentConfigValues: {},
  };
};

const extractImage = storyObject => storyObject.promo_items && storyObject.promo_items.basic && storyObject.promo_items.basic.type === 'image' && storyObject.promo_items.basic.url;

const unserializeStory = storyObject => ({
  id: storyObject._id,
  itemTitle: storyObject.headlines.basic,
  imageURL: extractImage(storyObject) || '',
});

// helpers end
// components start
const Title = styled.h2`
  font-family: ${props => props.primaryFont};
`;

const StoryItem = (props) => {
  const {
    itemTitle = '', imageURL = '', id = '', primaryFont = '',
  } = props;

  return (
    <div key={id} className="list-item-simple">
      <div className="simple-list-image-container">
        {
          imageURL !== ''
            ? (
              <img
                src={imageURL}
                alt={itemTitle}
                className="simple-list-img"
              />
            )
            : <div className="simple-list-placeholder" />
        }
      </div>
      {itemTitle !== ''
        ? (
          <div primaryFont={primaryFont} className="simple-list-headline-anchor">
            <Title className="simple-list-headline-text">
              {itemTitle}
            </Title>
          </div>
        )
        : null}
    </div>
  );
};

@Consumer
class StoryItemContainer extends Component {
  render() {
    const {
      arcSite = '', itemTitle = '', imageURL = '', id = '',
    } = this.props;

    const themeStyle = getThemeStyle(arcSite);

    const primaryFont = themeStyle && themeStyle['primary-font-family'] ? themeStyle['primary-font-family'] : '';

    return (
      <>
        <StoryItem primaryFont={primaryFont} itemTitle={itemTitle} imageURL={imageURL} id={id} />
      </>
    );
  }
}

// need to provide unique id for react stability reasons
const StoryItemList = ({ listItems = [] }) => (
  <>
    {
      listItems.map(({ id, itemTitle = '', imageURL = '' }) => (
        <StoryItemContainer key={id} id={id} itemTitle={itemTitle} imageURL={imageURL} />
      ))
    }
  </>
);

@Consumer
class ListTitle extends Component {
  render() {
    const {
      arcSite,
      title,
    } = this.props;

    const themeStyle = getThemeStyle(arcSite);

    const primaryFont = themeStyle && themeStyle['primary-font-family'] ? themeStyle['primary-font-family'] : '';

    return (
      <>
        <Title className="list-title" primaryFont={primaryFont}>{title}</Title>
      </>
    );
  }
}
// components end

const SimpleList = (props) => {
  // id seems to be generated by the engine
  const { customFields = {}, id = '' } = props;

  const { title = '' } = customFields;


  const { contentService, contentConfigValues } = getContentConfig(props);

  // set defualt value for list items
  let listItems = [];

  if (contentService !== '') {
    const rawQueryResponse = useContent({
      source: contentService,
      query: contentConfigValues,
    });

    if (rawQueryResponse
      && rawQueryResponse.content_elements && rawQueryResponse.content_elements.length > 0) {
      listItems = [...rawQueryResponse.content_elements.map(unserializeStory)];
    }
  }

  return (
    <div key={id} className="list-container">
      {title.length > 0 ? <ListTitle title={title} /> : null}
      {listItems.length > 0 ? <StoryItemList listItems={listItems} /> : null}
    </div>
  );
};

SimpleList.propTypes = {
  customFields: PropTypes.shape({
    title: PropTypes.string.tag({ label: 'Title' }),
    listContentConfig: PropTypes.contentConfig('ans-feed').tag({ label: 'Display Content Info' }),
  }),
};


SimpleList.label = 'Simple List – Arc Block';

// helper components
export {
  StoryItem,
  StoryItemContainer,
  StoryItemList,
  ListTitle,
};

export default SimpleList;
