import React from 'react';
import styled from 'styled-components';
import { Overline as OverlineOutput } from '@wpmedia/shared-styles';

const BlockOverline = styled(OverlineOutput)`
  font-size: 1.25rem;
`;

const Overline = () => <BlockOverline />;

Overline.label = 'Overline – Arc Block';

export default Overline;
