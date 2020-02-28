import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Page } from '@sparkpost/matchbox';
import { UsageReport } from 'src/components';
import { GettingStartedGuide } from './components/GettingStartedGuide';
import VerifyEmailBanner from 'src/components/verifyEmailBanner/VerifyEmailBanner';
import { FreePlanWarningBanner } from 'src/pages/billing/components/Banners';
import { hasGrants } from 'src/helpers/conditions';
/* helpers */
import { getAccountUiOptionValue } from 'src/helpers/conditions/account';
import { isAdmin } from 'src/helpers/conditions/user';

/* actions */
import { setAccountOption } from 'src/actions/account';

export function DashboardPage(props) {
  const {
    accountAgeInDays,
    currentUser,
    account,
    listApiKeys,
    listSendingDomains,
    canManageKeys,
    canManageSendingDomains,
  } = props;

  useEffect(() => {
    if (canManageKeys) {
      listApiKeys({ id: 0 });
    }
  }, [listApiKeys, canManageKeys]);

  useEffect(() => {
    if (canManageSendingDomains) {
      listSendingDomains();
    }
  }, [listSendingDomains, canManageSendingDomains]);

  const displayGuideAndReport = () => {
    const {
      onboarding: {
        isGuideAtBottom,
        send_test_email_completed,
        explore_analytics_completed,
        invite_collaborator_completed,
        view_developer_docs_completed,
      } = {},
      hasSendingDomains,
      hasApiKeysForSending,
      canManageKeys,
      canManageSendingDomains,
    } = props;
    const usageReport = <UsageReport />;
    const gettingStartedGuide =
      canManageKeys && canManageSendingDomains ? <GettingStartedGuide {...props} /> : null;
    const areAllGuidesCompleted =
      send_test_email_completed &&
      explore_analytics_completed &&
      invite_collaborator_completed &&
      view_developer_docs_completed &&
      hasSendingDomains &&
      hasApiKeysForSending;

    if (isGuideAtBottom || areAllGuidesCompleted) {
      return (
        <>
          {usageReport}
          {gettingStartedGuide}
        </>
      );
    }
    return (
      <>
        {gettingStartedGuide}
        {usageReport}
      </>
    );
  };

  //Shows banner if within 14 days of plan to downgrade

  return (
    <Page title="Dashboard">
      {currentUser.email_verified === false && (
        <VerifyEmailBanner verifying={currentUser.verifyingEmail} />
      )}
      <FreePlanWarningBanner
        account={account}
        accountAgeInDays={accountAgeInDays}
        ageRangeStart={16}
      />
      {displayGuideAndReport()}
    </Page>
  );
}
const mapStateToProps = state => ({
  onboarding: getAccountUiOptionValue('onboarding')(state),
  canManageKeys: hasGrants('api_keys/manage')(state),
  canManageSendingDomains: hasGrants('sending_domains/manage')(state),
  isAdmin: isAdmin(state),
});

export default connect(mapStateToProps, { setAccountOption })(DashboardPage);
