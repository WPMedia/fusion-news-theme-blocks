import React, { Fragment } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { useFusionContext } from 'fusion:context';
import getThemeStyle from 'fusion:themes';
import getProperties from 'fusion:properties';
import getTranslatedPhrases from 'fusion:intl';
import {
  Gallery, ImageMetadata, Image,
  // presentational component does not do data fetching
  VideoPlayer as VideoPlayerPresentational,
  LazyLoad,
  isServerSide,
  videoPlayerCustomFields,
} from '@wpmedia/engine-theme-sdk';
import Header from './_children/heading';
import HTML from './_children/html';
import List from './_children/list';
import Oembed from './_children/oembed';
import Quote from './_children/quote';
import Table from './_children/table';
import './_articlebody.scss';

const StyledText = styled.p`
  a {
    color: ${(props) => props.primaryColor};
  }
`;

const StyledLink = styled.a`
  border-bottom: 1px solid ${(props) => props.primaryColor};
  color: ${(props) => props.primaryColor};
`;

// IMPROVEMENT: margin and margin bottom rem is reusable
const FloatableImageContainer = styled.figure`
  margin: 0 0 0 1rem;

  @media screen and (min-width: 48rem) {
    margin-bottom: 1.5rem;
  }

  ${({ allowedFloatValue }) => allowedFloatValue && css`
    width: 50%;
    float: ${allowedFloatValue};
  `}

  ${({ allowedFloatValue }) => allowedFloatValue === 'left' && css`
    margin-right: 1rem;

    @media screen and (min-width: 48rem) {
      margin-right: 1.5rem;
    }
  `}

  ${({ allowedFloatValue }) => allowedFloatValue === 'right' && css`
    margin-left: 1rem;

    @media screen and (min-width: 48rem) {
      margin-left: 1.5rem;
    }
  `}
`;

function parseArticleItem(item, index, arcSite, phrases, id, customFields) {
  const {
    _id: key = index, type, content,
  } = item;

  // TODO: Split each type into a separate reusable component
  switch (type) {
    case 'text': {
      return (content && content.length > 0) ? (
        <StyledText
          primaryColor={getThemeStyle(arcSite)['primary-color']}
          className="body-paragraph"
          key={key}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : null;
    }
    case 'copyright': {
      return (content && content.length > 0) ? (
        <StyledText
          primaryColor={getThemeStyle(arcSite)['primary-color']}
          className="body-paragraph body-copyright"
          key={key}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : null;
    }
    case 'divider': {
      return (
        <Fragment key={key}>
          <div className="divider">
            <hr />
          </div>
        </Fragment>
      );
    }
    case 'image': {
      const {
        url,
        subtitle,
        caption,
        credits,
        alt_text: altText,
        resized_params: resizedImageOptions = {},
        vanity_credits: vanityCredits,
        // alignment not always present
        alignment = '',
      } = item;

      let widthsObject = {
        small: 768,
        medium: 1024,
        large: 1440,
      };

      // only left and right float supported
      const allowedFloatValue = alignment === 'left' || alignment === 'right' ? alignment : '';

      if (allowedFloatValue) {
        // cut the image width in about half if left or right aligned
        // matched based on allowed widths
        // the goal was to show 50% of width
        widthsObject = {
          small: 274,
          medium: 400,
          large: 768,
        };
      }

      return (url && url.length > 0) ? (
        <FloatableImageContainer
          key={key}
          allowedFloatValue={allowedFloatValue}
        >
          <Image
            resizedImageOptions={resizedImageOptions}
            url={url}
            alt={altText}
            smallWidth={widthsObject.small}
            smallHeight={0}
            mediumWidth={widthsObject.medium}
            mediumHeight={0}
            largeWidth={widthsObject.large}
            largeHeight={0}
            breakpoints={getProperties(arcSite)?.breakpoints}
            resizerURL={getProperties(arcSite)?.resizerURL}
          />
          <figcaption>
            <ImageMetadata
              subtitle={subtitle}
              caption={caption}
              credits={credits}
              vanityCredits={vanityCredits}
            />
          </figcaption>
        </FloatableImageContainer>
      ) : null;
    }

    case 'interstitial_link': {
      const { url } = item;
      if (!(url && content)) return null;
      const beforeContent = '[&nbsp;';
      const afterContent = '&nbsp;]';
      return (url && url.length > 0) ? (
        <Fragment key={key}>
          <p className="interstitial-link block-margin-bottom">
            <span dangerouslySetInnerHTML={{ __html: beforeContent }} />
            <StyledLink
              href={url}
              aria-label={phrases.t('article-body-block.interstitial-link-aria-label')}
              dangerouslySetInnerHTML={{ __html: content }}
              primaryColor={getThemeStyle(arcSite)['primary-color']}
            />
            <span dangerouslySetInnerHTML={{ __html: afterContent }} />
          </p>
        </Fragment>
      ) : null;
    }

    case 'raw_html': {
      return (content && content.length > 0) ? (
        <HTML
          key={key}
          id={key}
          content={content}
          primaryColor={getThemeStyle(arcSite)['primary-color']}
        />
      ) : null;
    }

    case 'list': {
      const { list_type: listType, items: listItems } = item;
      // eslint-disable-next-line arrow-body-style
      return (listItems && listItems.length > 0) ? (
        <Fragment key={key}>
          <List
            listType={listType}
            listItems={listItems}
            primaryColor={getThemeStyle(arcSite)['primary-color']}
          />
        </Fragment>
      ) : null;
    }

    case 'correction': {
      // can either be clarification or correction
      const { correction_type: labelType } = item;
      const labelText = labelType === 'clarification'
        ? phrases.t('article-body-block.clarification')
        : phrases.t('article-body-block.correction');

      return (item.text && item.text.length > 0) ? (
        <Fragment key={key}>
          <section className="correction container-margin-responsive-bottom">
            <h2 className="h6-primary">{labelText}</h2>
            <p>{item.text}</p>
          </section>
        </Fragment>
      ) : null;
    }

    case 'header':
      return (item.content && item.content.length > 0) ? (
        <Header key={key} element={item} primaryColor={getThemeStyle(arcSite)['primary-color']} />
      ) : null;

    case 'oembed_response': {
      return item.raw_oembed ? (
        <Oembed key={key} element={item} />
      ) : null;
    }

    case 'table': {
      return item.rows ? (
        <Table key={key} element={item} />
      ) : null;
    }

    case 'quote':
      switch (item.subtype) {
        case 'pullquote':
          return (
            <Quote key={key} element={item} className="pullquote" />
          );

        case 'blockquote':
        default:
          return (
            <Quote key={key} element={item} />
          );
      }
    case 'video':
      return (
        <section key={key} className="block-margin-bottom">
          <VideoPlayerPresentational
            id={id}
            embedMarkup={item.embed_html}
            shrinkToFit={customFields?.shrinkToFit}
            viewportPercentage={customFields?.viewportPercentage}
          />
        </section>
      );
    case 'gallery':
      return (
        <section key={key} className="block-margin-bottom gallery">
          <Gallery
            galleryElements={item.content_elements}
            resizerURL={getProperties(arcSite)?.resizerURL}
            ansId={item._id}
            ansHeadline={item.headlines.basic ? item.headlines.basic : ''}
            autoplayPhraseLabels={{
              start: phrases.t('global.gallery-autoplay-label-start'),
              stop: phrases.t('global.gallery-autoplay-label-stop'),
            }}
            controlsFont={getThemeStyle(arcSite)['primary-font-family']}
            expandPhrase={phrases.t('global.gallery-expand-button')}
            autoplayPhrase={phrases.t('global.gallery-autoplay-button')}
            pausePhrase={phrases.t('global.gallery-pause-autoplay-button')}
            pageCountPhrase={(current, total) => phrases.t('global.gallery-page-count-text', { current, total })}
          />
        </section>
      );
    default:
      return null;
  }
}

const ArticleBody = styled.article`
  font-family: ${(props) => props.secondaryFont};

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  figcaption,
  table {
    font-family: ${(props) => props.primaryFont};
  }

  .body-paragraph,
  .interstitial-link,
  ol,
  ul,
  blockquote p,
  blockquote {
    font-family: ${(props) => props.secondaryFont};
  }
`;

const ArticleBodyChainItems = ({ children }) => {
  const {
    globalContent: items = {},
    customFields = {},
    arcSite,
    id,
  } = useFusionContext();

  const { content_elements: contentElements = [], location } = items;
  const { elementPlacement: adPlacementConfigObj = {} } = customFields;
  const { locale = 'en' } = getProperties(arcSite);
  const phrases = getTranslatedPhrases(locale);

  const adPlacements = Object.keys(adPlacementConfigObj).map(
    (key) => ({ feature: +key, paragraph: +adPlacementConfigObj[key] }),
  );

  const paragraphTotal = contentElements.filter((element) => element.type === 'text').length;

  let paragraphCounter = 0;
  const articleBody = [
    ...contentElements.map((contentElement, index) => {
      if (contentElement.type === 'text') {
        // Start at 1 since the ad configs use one-based array indexes
        paragraphCounter += 1;

        const adsAfterParagraph = adPlacements.filter(
          (placement) => placement.paragraph === paragraphCounter,
        );

        if (paragraphCounter === 1 && location && contentElement.content.indexOf(`${location} &mdash;`) !== 0) {
          // eslint-disable-next-line no-param-reassign
          contentElement.content = `${location} &mdash; ${contentElement.content}`;
        }

        // The ad features should follow the content element if they exist, but not if
        // the current paragraph is the last or second-to-last paragraph.
        if (adsAfterParagraph.length && paragraphCounter < paragraphTotal - 1) {
          return [
            parseArticleItem(contentElement, index, arcSite, phrases, id, customFields),
            ...adsAfterParagraph.map((placement) => children[placement.feature - 1]),
          ];
        }
      }

      return parseArticleItem(contentElement, index, arcSite, phrases, id, customFields);
    }),
    ...(items.copyright ? [parseArticleItem(
      {
        type: 'copyright',
        content: items.copyright,
      },
      'copyright-text',
      arcSite,
      null, // phrases not used by text type
      null, // id not used by text type
      {}, // customFields only used in video
    )] : []),
  ];

  return (
    <ArticleBody
      className="article-body-wrapper"
      primaryFont={getThemeStyle(arcSite)['primary-font-family']}
      secondaryFont={getThemeStyle(arcSite)['secondary-font-family']}
    >
      { articleBody }
    </ArticleBody>
  );
};

const ArticleBodyChain = ({ customFields = {}, children }) => {
  const { isAdmin } = useFusionContext();
  if (customFields.lazyLoad && isServerSide() && !isAdmin) { // On Server
    return null;
  }
  return (
    <LazyLoad enabled={customFields.lazyLoad && !isAdmin}>
      <ArticleBodyChainItems customFields={{ ...customFields }}>
        {children}
      </ArticleBodyChainItems>
    </LazyLoad>
  );
};

ArticleBodyChain.propTypes = {
  customFields: PropTypes.shape({
    elementPlacement: PropTypes.kvp.tag({
      label: 'Ad placements',
      group: 'Inline ads',
      description: 'Places your inline article body ads in the article body chain. For each ad feature in the chain, fill in two values below: Field 1) The position of the ad within the chain and Field 2) the paragraph number that this ad should follow in the article body. For example, entering 1 and 3 would mean that the first ad in the article body chain will be placed after the third paragraph in the article.',
    }),
    lazyLoad: PropTypes.bool.tag({
      name: 'Lazy Load block?',
      defaultValue: false,
      description: 'Turning on lazy-loading will prevent this block from being loaded on the page until it is nearly in-view for the user.',
    }),
    ...(videoPlayerCustomFields()),
  }),
};

ArticleBodyChain.label = 'Article Body – Arc Block';

export default ArticleBodyChain;
