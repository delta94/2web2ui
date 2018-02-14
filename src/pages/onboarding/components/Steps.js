import React, { Component } from 'react';
import cx from 'classnames';
import { withRouter } from 'react-router';
import { Icon } from '@sparkpost/matchbox';
import styles from './Steps.module.scss';

// TODO Finalize when whole register flow is complete
const steps = [
  { path: 'plan', label: 'Confirm your Plan' },
  // TODO show/hide this based on plan selected, maybe from qp?
  { path: 'dedicated-ip', label: 'Add a Dedicated IP' },
  { path: 'sending-domain', label: 'Add a Domain' },
  { path: 'email', label: 'Send an Email' }
];

class Steps extends Component {
  state = {
    currentStep: 0
  }

  componentDidMount() {
    const { location } = this.props;

    steps.forEach((step, i) => {
      if (location.pathname.includes(step.path)) {
        this.setState({ currentStep: i });
      }
    });
  }

  render() {
    const { currentStep } = this.state;

    const items = steps.map(({ path, label }, i) => {
      const completed = currentStep > i;
      const classes = cx(
        styles.Item,
        completed && styles.completed,
        currentStep === i && styles.current
      );

      return (
        <li className={classes} key={label}>
          {!completed ? `${i + 1}.` : <Icon name='Check' />} {label}
        </li>
      );
    });

    return <ul className={styles.Steps}>{items}</ul>;
  }
}

export default withRouter(Steps);
