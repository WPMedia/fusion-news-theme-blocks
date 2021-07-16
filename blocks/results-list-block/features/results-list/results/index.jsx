import React, {
  createRef, useCallback, useEffect, useReducer, useState,
} from 'react';

import styled from 'styled-components';
import getThemeStyle from 'fusion:themes';
import { useContent } from 'fusion:content';

import ResultItem from './result-item';
import { reduceResultList } from './helpers';

const ReadMoreButton = styled.button`
  background-color: ${(props) => props.primaryColor};
  font-family: ${(props) => props.primaryFont};

  &:not(:disabled):not(.disabled):active:hover,
  &:not(:disabled):not(.disabled):hover:hover {
    background-color: ${(props) => props.primaryColor};
  }
`;

const Results = ({
  arcSite,
  configuredOffset,
  configuredSize,
  contentConfigValues,
  contentService,
  imageProperties,
  isServerSideLazy = false,
  phrases,
  showByline = false,
  showDate = false,
  showDescription = false,
  showHeadline = false,
  showImage = false,
  targetFallbackImage,
}) => {
  const [queryOffset, setQueryOffset] = useState(configuredOffset);

  const placeholderResizedImageOptions = useContent({
    source: !targetFallbackImage.includes('/resources/') ? 'resize-image-api' : null,
    query: { raw_image_url: targetFallbackImage, respect_aspect_ratio: true },
  });

  const serviceQueryPage = useCallback((requestedOffset) => {
    /*
      This sets up a window view of the data starting from the initial index
      to *twice* the size.  When clicking on the more button, we will render
      the next size worth of items and load the next size from the server.
    */
    const size = requestedOffset === configuredOffset
      ? configuredSize * 2
      : configuredSize;
    const offset = requestedOffset === configuredOffset
      ? configuredOffset
      : requestedOffset + configuredSize;
    switch (contentService) {
      case 'story-feed-query': {
        return { offset, size };
      }
      case 'story-feed-author':
      case 'story-feed-sections':
      case 'story-feed-tag': {
        return { feedOffset: offset, feedSize: size };
      }
      case 'content-api-collections': {
        return { from: offset, size };
      }
      default: { break; }
    }
    return {};
  }, [configuredOffset, configuredSize, contentService]);

  const requestedResultList = useContent({
    source: isServerSideLazy ? null : contentService,
    query: {
      ...contentConfigValues,
      feature: 'results-list',
      ...serviceQueryPage(queryOffset),
    },
    filter: `{
      count
      next
      content_elements {
        _id,
        type
        display_date
        credits {
          by {
            _id
            name
            url
            type
            additional_properties {
              original {
                byline
              }
            }
          }
        }
        headlines {
          basic
        }
        description {
          basic
        }
        promo_items {
          basic {
            type
            url
            resized_params {
              274x154
              158x89
            }
          }
          lead_art {
            promo_items {
              basic {
                type
                url
                resized_params {
                  274x154
                  158x89
                }
              }
            }
            type
          }
        }
        websites {
          ${arcSite} {
            website_url
          }
        }
      }
    }`,
  });

  const [resultList, alterResultList] = useReducer(reduceResultList, requestedResultList);

  useEffect(() => {
    if (requestedResultList) {
      alterResultList({
        type: 'appendUnique',
        data: requestedResultList,
      });
    }
  }, [requestedResultList]);

  const [elementRefs, setElementRefs] = useState([]);
  const [focalElement, setFocalElement] = useState(null);
  useEffect(() => {
    setElementRefs((existingRefs) => {
      const refArray = existingRefs.concat(
        requestedResultList?.content_elements
          ? requestedResultList.content_elements.map(() => createRef())
          : [],
      );
      if (queryOffset !== configuredOffset) { // ignore the first item for focus purposes
        const topItem = queryOffset - configuredOffset;
        setFocalElement(refArray[topItem]);
      }
      return refArray;
    });
  }, [configuredOffset, queryOffset, requestedResultList]);

  useEffect(() => {
    if (focalElement?.current) {
      const focusLink = focalElement.current.querySelector('a:not([aria-hidden])');
      if (focusLink) {
        focusLink.focus();
      }
    }
  }, [focalElement]);

  const viewableElements = resultList?.content_elements
    .slice(0, queryOffset + configuredSize - configuredOffset);

  const isThereMore = requestedResultList?.next
    || viewableElements?.length < resultList?.count - configuredOffset;

  const onReadMoreClick = useCallback(() => {
    setQueryOffset((oldOffset) => oldOffset + configuredSize);
  }, [configuredSize, setQueryOffset]);

  return (viewableElements?.length > 0 && !isServerSideLazy) ? (
    <div className="results-list-container">
      {viewableElements.map((element, index) => (
        <ResultItem
          key={`result-card-${element._id}`}
          ref={elementRefs[index]}
          arcSite={arcSite}
          element={element}
          imageProperties={imageProperties}
          placeholderResizedImageOptions={placeholderResizedImageOptions}
          showByline={showByline}
          showDate={showDate}
          showDescription={showDescription}
          showHeadline={showHeadline}
          showImage={showImage}
          targetFallbackImage={targetFallbackImage}
        />
      ))}
      {isThereMore && (
        <div className="see-more">
          <ReadMoreButton
            aria-label={phrases.t('results-list-block.see-more-button-aria-label')}
            type="button"
            className="btn btn-sm"
            onClick={onReadMoreClick}
            primaryFont={getThemeStyle(arcSite)['primary-font-family']}
            primaryColor={getThemeStyle(arcSite)['primary-color']}
          >
            {phrases.t('results-list-block.see-more-button')}
          </ReadMoreButton>
        </div>
      )}
    </div>
  ) : null;
};

export default Results;
