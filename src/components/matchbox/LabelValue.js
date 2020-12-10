import React from 'react';
import { LabelValue as HibanaLabelValue } from '@sparkpost/matchbox-hibana';
import { Box } from 'src/components/matchbox';
import { useHibana } from 'src/context/HibanaContext';

// TODO: There is some custom handling of the `dark` prop on our end, though ideally
// this would be handled by Matchbox instead. I filed a ticket, so a lot of the code
// that manages the `dark` prop would be removable at that point in time:
// https://github.com/SparkPost/matchbox/issues/709

const ERROR_MESSAGE = 'LabelValue components can only be used with Hibana enabled.';

function LabelValue(props) {
  const { children, ...rest } = props;
  const [state] = useHibana();
  const { isHibanaEnabled } = state;
  // If passed in children are relevant to this compound component,
  // clone the child components with relevant props. This allows
  // for a simpler API.
  const renderedChildren = React.Children.map(children, child => {
    if (child.type.displayName === 'LabelValue.Label' || 'LabelValue.Value') {
      return React.cloneElement(child, { dark: props.dark });
    }
  });

  if (!isHibanaEnabled) throw new Error(ERROR_MESSAGE);

  return <HibanaLabelValue {...rest}>{renderedChildren}</HibanaLabelValue>;
}

function Label(props) {
  const { children, ...rest } = props;
  const [state] = useHibana();
  const { isHibanaEnabled } = state;
  const renderedChildren = props.dark ? <Box color="gray.600">{children}</Box> : children;

  if (!isHibanaEnabled) throw new Error(ERROR_MESSAGE);

  return <HibanaLabelValue.Label {...rest}>{renderedChildren}</HibanaLabelValue.Label>;
}

function Value(props) {
  const { children, ...rest } = props;
  const [state] = useHibana();
  const { isHibanaEnabled } = state;
  const renderedChildren = props.dark ? <Box color="white">{children}</Box> : children;

  if (!isHibanaEnabled) throw new Error(ERROR_MESSAGE);

  return <HibanaLabelValue.Value {...rest}>{renderedChildren}</HibanaLabelValue.Value>;
}

Label.displayName = 'LabelValue.Label';
Value.displayName = 'LabelValue.Value';
LabelValue.Label = Label;
LabelValue.Value = Value;

export default LabelValue;
