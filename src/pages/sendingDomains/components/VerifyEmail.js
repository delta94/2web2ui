import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Button, Modal, Panel, Stack, TextField } from 'src/components/matchbox';
import { selectHasAnyoneAtDomainVerificationEnabled } from 'src/selectors/account';

import styles from './VerifyEmail.module.scss';
import { required } from 'src/helpers/validation';

// actions
import { showAlert } from 'src/actions/globalAlert';
import * as sendingDomainsActions from 'src/actions/sendingDomains';

export class VerifyEmail extends Component {
  state = {
    localPart: '',
  };

  verifyWithAbuse = () => {
    const { id, subaccount, verifyAbuse } = this.props;

    return verifyAbuse({ id, subaccount }).then(this.onVerifySuccess(`abuse@${id}`));
  };

  verifyWithCustom = () => {
    const { id, subaccount, verifyMailbox } = this.props;
    const { localPart } = this.state;
    const error = required(localPart);

    if (error) {
      return this.setState({ error });
    }

    return verifyMailbox({ id, mailbox: localPart, subaccount }).then(
      this.onVerifySuccess(`${localPart}@${id}`),
    );
  };

  verifyWithPostmaster = () => {
    const { id, subaccount, verifyPostmaster } = this.props;

    return verifyPostmaster({ id, subaccount }).then(this.onVerifySuccess(`postmaster@${id}`));
  };

  onVerifySuccess = email => () => {
    this.props.showAlert({ type: 'success', message: `Email sent to ${email}` });
  };

  renderAllowAnyoneAt = () => {
    const { id, submitting } = this.props;
    const { localPart } = this.state;

    return (
      <>
        <Panel.Section>
          <Stack>
            <p>
              Start sending email from this domain by sending a verification email to any mailbox on
              your domain using the form below.
            </p>

            <Grid>
              <Grid.Column xs={6}>
                <div>
                  <TextField
                    id="localPart"
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    connectRight={<strong className={styles.Domain}>{`@${id}`}</strong>}
                    value={localPart}
                    error={this.state.error}
                  />
                </div>
              </Grid.Column>
            </Grid>
          </Stack>
        </Panel.Section>

        <Panel.Section>
          <VerifyButton onClick={this.verifyWithCustom} submitting={submitting} />
        </Panel.Section>
      </>
    );
  };

  onChange = event => {
    this.setState({
      localPart: event.currentTarget.value,
    });
  };

  onBlur = ({ currentTarget }) => {
    this.setState({ error: required(currentTarget.value) });
  };

  renderAllowMailboxVerification = () => {
    const { id, submitting } = this.props;

    return (
      <>
        <Panel.Section>
          <p>
            Start sending email from this domain by sending a verification email to one of the
            addresses below.
          </p>
        </Panel.Section>

        <Panel.Section>
          <Grid middle="xs">
            <Grid.Column xs={6}>
              <p>
                <strong>{`postmaster@${id}`}</strong>
              </p>
            </Grid.Column>
            <Grid.Column xs={6} style={{ textAlign: 'right' }}>
              <VerifyButton
                onClick={this.verifyWithPostmaster}
                variant="secondary"
                submitting={submitting}
              />
            </Grid.Column>
          </Grid>
        </Panel.Section>

        <Panel.Section>
          <Grid middle="xs">
            <Grid.Column xs={6}>
              <p>
                <strong>{`abuse@${id}`}</strong>
              </p>
            </Grid.Column>
            <Grid.Column xs={6} style={{ textAlign: 'right' }}>
              <VerifyButton
                onClick={this.verifyWithAbuse}
                variant="secondary"
                submitting={submitting}
              />
            </Grid.Column>
          </Grid>
        </Panel.Section>
      </>
    );
  };

  render() {
    const { open, onCancel, hasAnyoneAtEnabled } = this.props;
    const renderVerification = hasAnyoneAtEnabled
      ? this.renderAllowAnyoneAt()
      : this.renderAllowMailboxVerification();

    return (
      <Modal open={open} onClose={onCancel} showCloseButton>
        <Panel title="Verify through Email">{renderVerification}</Panel>
      </Modal>
    );
  }
}

function VerifyButton({ onClick, variant = 'primary', submitting }) {
  return (
    <Button variant={variant} disabled={submitting} onClick={onClick}>
      {submitting ? 'Sending Email...' : 'Send Email'}
    </Button>
  );
}

const mapStateToProps = state => ({
  submitting: state.sendingDomains.verifyEmailLoading,
  hasAnyoneAtEnabled: selectHasAnyoneAtDomainVerificationEnabled(state),
});

export default connect(mapStateToProps, { ...sendingDomainsActions, showAlert })(VerifyEmail);
