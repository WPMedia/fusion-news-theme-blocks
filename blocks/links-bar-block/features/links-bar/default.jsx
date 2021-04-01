import PropTypes from 'prop-types';
import { useContent } from 'fusion:content';
import { useFusionContext } from 'fusion:context';
import composeHooks from './compose-hooks';
import LinkBar from './link-bar';

const LinksBar = composeHooks((props) => ({
  useFusionContext,
  useContent: () => useContent({
    source: props.customFields.navigationConfig.contentService,
    query: {
      ...props.customFields.navigationConfig.contentConfigValues,
    },
  }),
}))(LinkBar);

LinksBar.label = 'Links Bar – Arc Block';

LinksBar.propTypes = {
  customFields: PropTypes.shape({
    navigationConfig: PropTypes.contentConfig('navigation-hierarchy').tag({
      group: 'Configure Content',
      label: 'Navigation',
    }),
  }),
};

export default LinksBar;
