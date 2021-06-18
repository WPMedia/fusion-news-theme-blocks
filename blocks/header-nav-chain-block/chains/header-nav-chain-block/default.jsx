/* eslint-disable no-plusplus */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useContent } from 'fusion:content';
import { useFusionContext } from 'fusion:context';
import getProperties from 'fusion:properties';
import getThemeStyle from 'fusion:themes';
import getTranslatedPhrases from 'fusion:intl';
import { useDebouncedCallback } from 'use-debounce';
import FocusTrap from 'focus-trap-react';
import {
  WIDGET_CONFIG,
  PLACEMENT_AREAS,
  NAV_BREAKPOINTS,
  getNavComponentPropTypeKey,
  getNavComponentIndexPropTypeKey,
  generateNavComponentPropTypes,
  getNavComponentDefaultSelection,
} from './nav-helper';
import SectionNav from './_children/section-nav';
import NavLogo from './_children/nav-logo';
import NavWidget from './_children/nav-widget';
// shares styles with header nav block
// can modify styles in shared styles block
// import '@wpmedia/shared-styles/scss/_header-nav.scss';
import HorizontalLinksBar from './_children/horizontal-links/default';

/* Global Constants */
// Since these values are used to coordinate multiple components, I thought I'd make them variables
// so we could just change the vars instead of multiple CSS values
const standardNavHeight = 56;
const navZIdx = 9;
const sectionZIdx = navZIdx - 1;

/* Styled Components */
const StyledNav = styled.nav`
  align-items: center;
  width: 100%;
  position: sticky;
  top: 0;
  margin-bottom: 0;
  z-index: 1;

  .news-theme-navigation-bar {
    @media screen and (max-width: ${(props) => props.breakpoint}px) {
      height: ${standardNavHeight}px;
    }
    @media screen and (min-width: ${(props) => props.breakpoint}px) {
      height: ${(props) => (props.scrolled ? standardNavHeight : props.navHeight)}px;
    }
    background-color: ${(props) => props.navBarBackground};
    transition: 0.5s;
    z-index: ${navZIdx};

    &.nav-logo, & > .nav-logo {
      img {
        height: auto;
        max-width: 240px;
        width: auto;
        transition: 0.5s;
        @media screen and (max-width: ${(props) => props.breakpoint}px) {
          max-height: 40px;
          min-width: 40px;
        }
        @media screen and (min-width: ${(props) => props.breakpoint}px) {
          max-height: ${(props) => (props.scrolled ? (standardNavHeight - 16) : (props.navHeight - 16))}px;
          min-width: ${(props) => (props.scrolled ? (standardNavHeight - 16) : (props.navHeight - 16))}px;
        }
      }
    }
  }

  * {
    font-family: ${(props) => props.font};
  }

`;

const StyledSectionDrawer = styled.div`
  font-family: ${(props) => props.font};
  z-index: ${sectionZIdx};

  @media screen and (max-width: ${(props) => props.breakpoint}px) {
    margin-top: ${standardNavHeight}px;
  }
  @media screen and (min-width: ${(props) => props.breakpoint}px) {
    margin-top: ${(props) => (props.scrolled ? standardNavHeight : props.navHeight)}px;
  }
`;

const StyledWarning = styled.div`
  background-color: #c30;
  color: #fff;
  display: flex;
  align-self: flex-start;
  padding: 6px;
`;

/* Main Component */
const Nav = (props) => {
  const {
    arcSite, isAdmin,
  } = useFusionContext();

  const {
    navColor,
    breakpoints = { small: 0, medium: 768, large: 992 },
    navBarBackground,
    locale = 'en',
  } = getProperties(arcSite);

  const phrases = getTranslatedPhrases(locale);

  const {
    'primary-color': primaryColor = '#000',
    'primary-font-family': primaryFont,
  } = getThemeStyle(arcSite);

  let backgroundColor = '#000';

  if (navBarBackground === 'primary-color') {
    backgroundColor = primaryColor;
  } else if (navColor === 'light') {
    backgroundColor = '#fff';
  }

  const {
    children = [],
    customFields,
  } = props;
  const {
    hierarchy,
    signInOrder,
    logoAlignment = 'center',
    horizontalLinksHierarchy,
    desktopNavivationStartHeight,
    shrinkDesktopNavivationHeight,
    showHorizontalSeperatorDots,
    ariaLabel,
    ariaLabelLink,
  } = customFields;

  const displayLinks = horizontalLinksHierarchy && logoAlignment === 'left';

  const navHeight = desktopNavivationStartHeight || 56;

  const showDotSeparators = showHorizontalSeperatorDots ?? true;

  const mainContent = useContent({
    source: 'site-service-hierarchy',
    query: {
      hierarchy,
      feature: 'header-nav-chain',
    },
    filter: `{
      children {
        _id
        node_type
        display_name
        name
        url
        children {
          _id
          node_type
          display_name
          name
          url
        }
      }
    }`,
  });

  const sections = (mainContent && mainContent.children) ? mainContent.children : [];

  const [isSectionDrawerOpen, setSectionDrawerOpen] = useState(false);
  const [isLogoVisible, setLogoVisibility] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeNavigation = () => {
    setSectionDrawerOpen(false);
    document.body.classList.remove('nav-open');
  };

  const closeDrawer = (event) => {
    const ele = event.target;
    if (ele.closest('.inner-drawer-nav')) {
      return;
    }
    closeNavigation();
  };

  const hamburgerClick = () => {
    setSectionDrawerOpen(!isSectionDrawerOpen);
    document.body.classList.toggle('nav-open');
  };

  // istanbul ignore next
  const onScrollEvent = (evt) => {
    if (!evt) {
      return;
    }

    const scrollTop = evt.target?.documentElement?.scrollTop;
    if (typeof scrollTop === 'undefined') {
      return;
    }

    if (scrollTop > 150) {
      setLogoVisibility(true);
    }
    if (scrollTop < 30) {
      setLogoVisibility(false);
    }
  };

  const [onScrollDebounced] = useDebouncedCallback(onScrollEvent, 100);

  // istanbul ignore next
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.keyCode === 27) {
        closeNavigation();
      }
    };

    window.addEventListener('keydown', handleEscKey, true);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  useEffect(() => {
    const mastHead = document.querySelector('.masthead-block-container .masthead-block-logo');
    if (!mastHead) {
      return undefined;
    }
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    // on small viewports we do not need this
    if (vw >= breakpoints.medium) {
      window.addEventListener('scroll', onScrollDebounced);
      return () => {
        window.removeEventListener('scroll', onScrollDebounced);
      };
    }
    // istanbul ignore next
    return undefined;
  }, [onScrollDebounced, breakpoints]);

  useEffect(() => {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    if (vw < breakpoints.medium) {
      setLogoVisibility(true);
      return undefined;
    }

    const timerID = setTimeout(() => {
      const mastHead = document.querySelector('.masthead-block-container .masthead-block-logo');
      if (!mastHead) {
        setLogoVisibility(true);
      }
    }, 1000);

    return () => {
      clearTimeout(timerID);
    };
  }, [breakpoints]);

  useEffect(() => {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    if (!shrinkDesktopNavivationHeight || vw < breakpoints.medium) {
      return undefined;
    }
    const handleScroll = () => {
      const pageOffset = window.pageYOffset;
      if (pageOffset > shrinkDesktopNavivationHeight) {
        setScrolled(true);
      } else if (pageOffset < (shrinkDesktopNavivationHeight - desktopNavivationStartHeight)) {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [shrinkDesktopNavivationHeight, desktopNavivationStartHeight, breakpoints]);

  const getNavWidgetType = (fieldKey) => (
    customFields[fieldKey] || getNavComponentDefaultSelection(fieldKey)
  );

  const hasUserConfiguredNavItems = () => {
    let userHasConfigured = false;
    const {
      slotCounts,
      sections: navBarSections,
    } = WIDGET_CONFIG[PLACEMENT_AREAS.NAV_BAR];
    navBarSections.forEach((side) => {
      NAV_BREAKPOINTS.forEach((bpoint) => {
        for (let i = 1; i <= slotCounts[bpoint]; i++) {
          const cFieldKey = getNavComponentPropTypeKey(side, bpoint, i);
          const navWidgetType = getNavWidgetType(cFieldKey);
          const matchesDefault = navWidgetType !== getNavComponentDefaultSelection(cFieldKey);
          if (!userHasConfigured && matchesDefault) userHasConfigured = true;
        }
      });
    });
    return userHasConfigured;
  };

  const WidgetList = ({ id, breakpoint, placement }) => {
    // istanbul ignore next
    if (!id || !breakpoint) return null;
    const { slotCounts } = WIDGET_CONFIG[placement];
    const widgetList = [];
    for (let i = 1; i <= slotCounts[breakpoint]; i++) {
      const cFieldKey = getNavComponentPropTypeKey(id, breakpoint, i);
      const cFieldIndexKey = getNavComponentIndexPropTypeKey(id, breakpoint, i);
      const navWidgetType = getNavWidgetType(cFieldKey);
      if (!!navWidgetType && navWidgetType !== 'none') {
        widgetList.push(
          <div
            className="nav-widget"
            key={`${id}_${breakpoint}_${i}`}
          >
            <NavWidget
              {...props}
              type={navWidgetType}
              position={customFields[cFieldIndexKey]}
              placement={placement}
              menuButtonClickAction={hamburgerClick}
            />
          </div>,
        );
      }
    }
    return widgetList;
  };

  const NavSection = ({ side }) => (
    // istanbul ignore next
    !side ? null : (
      <div key={side} className={`nav-${side}`}>
        {
          // Support for deprecated 'signInOrder' custom field
          // "If" condition is for rendering "signIn" element
          // "Else" condition is for standard nav bar customization logic
          side === 'right'
          && !hasUserConfiguredNavItems()
          && signInOrder
          && Number.isInteger(signInOrder)
          && children[signInOrder - 1]
            ? children[signInOrder - 1]
            : NAV_BREAKPOINTS.map((breakpoint) => (
              <div key={breakpoint} className={`nav-components--${breakpoint}`}>
                <WidgetList
                  id={side}
                  breakpoint={breakpoint}
                  placement={PLACEMENT_AREAS.NAV_BAR}
                />
              </div>
            ))
        }
      </div>
    )
  );

  const MenuWidgets = () => {
    const navSection = 'menu';
    return (
      <div key={navSection} className={`nav-${navSection}`}>
        {NAV_BREAKPOINTS.map((breakpoint) => (
          <div key={breakpoint} className={`nav-components--${breakpoint}`}>
            <WidgetList
              id={navSection}
              breakpoint={breakpoint}
              placement={PLACEMENT_AREAS.SECTION_MENU}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <StyledNav
        id="main-nav"
        className={`${navColor === 'light' ? 'light' : 'dark'}`}
        font={primaryFont}
        navBarBackground={backgroundColor}
        navHeight={navHeight}
        scrolled={scrolled}
        breakpoint={breakpoints.medium}
        aria-label={ariaLabel || phrases.t('header-nav-chain-block.sections-element-aria-label')}
      >
        <div className={`news-theme-navigation-container news-theme-navigation-bar logo-${logoAlignment} ${displayLinks ? 'horizontal-links' : ''}`}>
          <NavSection side="left" />
          <NavLogo isVisible={isLogoVisible} alignment={logoAlignment} />
          {displayLinks && (
            <HorizontalLinksBar
              hierarchy={horizontalLinksHierarchy}
              navBarColor={navColor}
              showHorizontalSeperatorDots={showDotSeparators}
              ariaLabel={ariaLabelLink}
            />
          )}
          <NavSection side="right" />
        </div>

        <StyledSectionDrawer
          id="nav-sections"
          className={`nav-sections ${isSectionDrawerOpen ? 'open' : 'closed'}`}
          font={primaryFont}
          navHeight={navHeight}
          scrolled={scrolled}
          breakpoint={breakpoints.medium}
          onClick={closeDrawer}
        >
          <FocusTrap
            active={isSectionDrawerOpen}
            focusTrapOptions={{
              allowOutsideClick: true,
              returnFocusOnDeactivate: true,
              onDeactivate: () => {
                // Focus the next focusable element in the navbar
                // Workaround for issue where 'nav-sections-btn' won't programatically focus
                const focusElement = document.querySelector(`
                  #main-nav a:not(.nav-sections-btn),
                  #main-nav button:not(.nav-sections-btn)
                `);
                // istanbul ignore next
                if (focusElement) {
                  focusElement.focus();
                  focusElement.blur();
                }
              },
            }}
          >
            <div className="inner-drawer-nav" style={{ zIndex: 10 }}>
              <SectionNav sections={sections} isHidden={!isSectionDrawerOpen}>
                <MenuWidgets />
              </SectionNav>
            </div>
          </FocusTrap>
        </StyledSectionDrawer>

        {(horizontalLinksHierarchy && logoAlignment !== 'left' && isAdmin) && (
          <StyledWarning>
            In order to render horizontal links, the logo must be aligned to the left.
          </StyledWarning>
        )}
      </StyledNav>
    </>
  );
};

/** Nav PropTypes */

Nav.propTypes = {
  customFields: PropTypes.shape({
    hierarchy: PropTypes.string.tag({
      label: 'Sections Menu hierarchy',
      defaultValue: '',
      group: 'Configure content',
    }),
    signInOrder: PropTypes.number.tag({
      hidden: true,
    }),
    logoAlignment: PropTypes.oneOf([
      'center', 'left',
    ]).tag({
      label: 'Logo alignment',
      group: 'Logo',
      defaultValue: 'center',
    }),
    horizontalLinksHierarchy: PropTypes.string.tag({
      label: 'Horizontal Links hierarchy',
      group: 'Configure content',
    }),
    desktopNavivationStartHeight: PropTypes.number.tag({
      label: 'Starting desktop navigation bar height',
      description: 'Select the height of the navigation bar (in px) when the user first opens a page on desktop. Must be between 56 and 200.',
      group: 'Logo',
      max: 200,
      min: 56,
      defaultValue: 56,
    }),
    shrinkDesktopNavivationHeight: PropTypes.number.tag({
      label: 'Shrink navigation bar after scrolling',
      description: 'How far should the user scroll (in px) until the navigation height shrinks back to standard size (56px) on desktop? Must be greater than the value configured for "Starting desktop navigation bar height".',
      group: 'Logo',
      min: 56,
    }),
    showHorizontalSeperatorDots: PropTypes.bool.tag({
      label: 'Display dots between horizontal links',
      group: 'Display',
      defaultValue: true,
    }),
    ariaLabel: PropTypes.string.tag({
      label: 'Aria-label',
      defaultValue: 'Sections Menu',
      description: 'The label is provided to assistive technologies to provide it with a unique name for the header nav landmark - defaults to "Sections Menu" if left blank',
    }),
    ariaLabelLink: PropTypes.string.tag({
      label: 'Links Bar - Aria-label',
      defaultValue: 'Top Links',
      description: 'The label is provided to assistive technologies to provide it with a unique name for the header links nav landmark - defaults to "Top Links" if left blank',
    }),
    ...generateNavComponentPropTypes(),
  }),
};

Nav.label = 'Navigation - Arc Chain';

export default Nav;
