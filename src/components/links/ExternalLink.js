import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { OpenInNew } from '@sparkpost/matchbox-icons';
import { Button, UnstyledLink } from 'src/components/matchbox';

const StyledIcon = styled('div')`
  margin: ${props => props.iconMargin};
`;

const ExternalLink = ({
  as: Component = UnstyledLink,
  children,
  component: _component, // ignore, won't apply external props correctly if set
  showIcon = true,
  icon: Icon = OpenInNew,
  iconSize = 13,
  iconMargin = '-0.1em 0 0 0',
  ...props
}) => {
  const isButton = Component.name === 'Button';

  if (isButton && Number(iconSize) === 13 && iconMargin === '-0.1em 0 0 0') {
    iconSize = 18;
    iconMargin = '0 0 0 .25em';
  }

  return (
    <Component {...props} external={true}>
      {children} {showIcon && <StyledIcon size={iconSize} as={Icon} iconMargin={iconMargin} />}
    </Component>
  );
};

ExternalLink.propTypes = {
  as: PropTypes.oneOf([Button, UnstyledLink]),
  children: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
  showIcon: PropTypes.bool,
};

export default ExternalLink;
