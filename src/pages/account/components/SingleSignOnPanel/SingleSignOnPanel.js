import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Panel } from 'src/components/matchbox';
import {
  getAccountSingleSignOnDetails,
  updateAccountSingleSignOn,
} from 'src/actions/accountSingleSignOn';
import { ExternalLink } from 'src/components/links';
import { PanelLoading } from 'src/components/loading';
import { LINKS } from 'src/constants';
import ProviderSection from './ProviderSection';
import StatusSection from './StatusSection';
import SCIMTokenSection from './SCIMTokenSection';
import { PANEL_LOADING_HEIGHT } from 'src/pages/account/constants';
import { isAccountUiOptionSet } from 'src/helpers/conditions/account';
import {
  generateScimToken,
  listScimToken,
  deleteScimToken,
  resetScimTokenErrors,
} from 'src/actions/scimToken';
import { showAlert } from 'src/actions/globalAlert';

export function SingleSignOnPanel(props) {
  const {
    getAccountSingleSignOnDetails,
    provider,
    tfaRequired,
    isSsoScimUiEnabled,
    loading,
    listScimToken,
    generateScimToken,
    deleteScimToken,
    scimTokenList,
    newScimToken,
    deleteScimTokenError,
    generateScimTokenError,
    resetScimTokenErrors,
    showAlert,
  } = props;
  useEffect(() => {
    getAccountSingleSignOnDetails();
  }, [getAccountSingleSignOnDetails]);
  useEffect(() => {
    if (isSsoScimUiEnabled) {
      listScimToken();
    }
  }, [isSsoScimUiEnabled, listScimToken]);

  const renderContent = () => {
    return (
      <>
        {tfaRequired && (
          <Panel.Section>
            <p>
              Single sign-on is not available while two-factor authentication is required on this
              account.
            </p>
          </Panel.Section>
        )}
        <ProviderSection readOnly={tfaRequired} provider={provider} />
        <StatusSection readOnly={tfaRequired} {...props} />
        {isSsoScimUiEnabled && provider && (
          <SCIMTokenSection
            showAlert={showAlert}
            scimTokenList={scimTokenList}
            newScimToken={newScimToken}
            generateScimToken={generateScimToken}
            listScimToken={listScimToken}
            deleteScimToken={deleteScimToken}
            resetScimTokenErrors={resetScimTokenErrors}
            error={deleteScimTokenError || generateScimTokenError}
          />
        )}
      </>
    );
  };

  if (loading) {
    return <PanelLoading minHeight={PANEL_LOADING_HEIGHT} />;
  }

  return (
    <Panel
      title="Single Sign-On"
      actions={[
        {
          color: 'orange',
          component: ExternalLink,
          content: 'Learn More',
          to: LINKS.SSO_GUIDE,
        },
      ]}
    >
      {renderContent()}
    </Panel>
  );
}

const mapDispatchToProps = {
  getAccountSingleSignOnDetails,
  updateAccountSingleSignOn,
  listScimToken,
  generateScimToken,
  deleteScimToken,
  resetScimTokenErrors,
  showAlert,
};

const mapStateToProps = state => ({
  ...state.accountSingleSignOn,
  tfaRequired: state.account.tfa_required,
  isSsoScimUiEnabled: isAccountUiOptionSet('sso_scim_section')(state),
  scimTokenList: state.scimToken.scimTokenList,
  newScimToken: state.scimToken.newScimToken,
  deleteScimTokenError: state.scimToken.deleteScimTokenError,
  generateScimTokenError: state.scimToken.generateScimTokenError,
});

export default connect(mapStateToProps, mapDispatchToProps)(SingleSignOnPanel);
