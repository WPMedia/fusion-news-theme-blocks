import React from 'react';
import styled from 'styled-components';
import getThemeStyle from 'fusion:themes';
import Link from './_children/link';

import './links-bar.scss';

const LinkBarSpan = styled.span`
  a {
    font-family: ${(props) => props.primaryFont};
  }
`;

const LinkBar = ({
  useFusionContext: { arcSite, id },
  useContent: { children: menuItems = [] },
}) => {
  const showSeparator = !!(menuItems.length > 1);

  return (
    <>
      <nav key={id} className="links-bar">
        {menuItems && menuItems.map((item, index) => (
          <LinkBarSpan
            className="links-menu"
            key={item._id}
            primaryFont={getThemeStyle(arcSite)['primary-font-family']}
          >
            {
              item.node_type === 'link'
                ? (
                  <Link href={item.url} name={item.display_name} />
                )
                : (
                  <Link href={item._id} name={item.name} />
                )
            }
            {(menuItems.length !== index + 1 && showSeparator) ? '\u00a0 • \u00a0' : ''}
          </LinkBarSpan>
        ))}
      </nav>
      <hr />
    </>
  );
};

export default LinkBar;
