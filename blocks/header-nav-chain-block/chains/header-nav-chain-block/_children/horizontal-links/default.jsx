import React from 'react';
import styled from 'styled-components';
import { useContent } from 'fusion:content';
import { useFusionContext } from 'fusion:context';
import getThemeStyle from 'fusion:themes';
import PropTypes from 'prop-types';
import Link from './_children/link';

import './links-bar.scss';

const LinkBarSpan = styled.span`
  color: ${(props) => (props.navBarColor === 'light' ? '#000' : '#fff')};

  a {
    font-family: ${(props) => props.primaryFont};
    white-space: nowrap;
  }
`;

const HorizontalLinksBar = ({
  hierarchy, navBarColor, showHorizontalSeperatorDots, customFields: { ariaLabel } = {},
}) => {
  const { id, arcSite } = useFusionContext();

  const content = useContent({
    source: 'site-service-hierarchy',
    query: {
      hierarchy,
      feature: 'links-bar',
    },
    filter: `{
      children {
        _id
        node_type
        display_name
        name
        url
      }
    }`,
  });

  const menuItems = (content && content.children) ? content.children : [];
  const showSeparator = !!(
    content
    && content.children
    && content.children.length > 1
    && showHorizontalSeperatorDots
  );

  const font = getThemeStyle(arcSite)['primary-font-family'];

  return (
    <>
      {}
      <nav
        key={id}
        className="horizontal-links-bar"
        aria-label={ariaLabel || 'Top Links'}
      >
        {menuItems && menuItems.map((item, index) => (
          <LinkBarSpan
            className="horizontal-links-menu"
            key={item._id}
            primaryFont={font}
            navBarColor={navBarColor}
          >
            {(index > 0 && showSeparator) ? '\u00a0 • \u00a0' : '\u00A0  \u00A0'}
            {
              item.node_type === 'link'
                ? (
                  <Link
                    href={item.url}
                    name={item.display_name}
                    navBarColor={navBarColor}
                  />
                )
                : (
                  <Link
                    href={item._id}
                    name={item.name}
                    navBarColor={navBarColor}
                  />
                )
            }
          </LinkBarSpan>
        ))}
      </nav>
    </>
  );
};

HorizontalLinksBar.propTypes = {
  customFields: PropTypes.shape({
    ariaLabel: PropTypes.string.tag({
      label: 'Aria-label',
      defaultValue: 'Top Links',
    }),
  }),
};

export default HorizontalLinksBar;
