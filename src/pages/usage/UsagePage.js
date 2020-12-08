import React from 'react';
import { Page, Layout } from 'src/components/matchbox';
import { ApiErrorBanner, Loading } from 'src/components';
import { useSparkPostQuery } from 'src/hooks';
import {
  selectEndOfBillingPeriod,
  selectStartOfBillingPeriod,
} from 'src/selectors/accountBillingInfo';
import { getAccount, getSubscription, getUsage, getUsageHistory } from 'src/helpers/api';
import { MessagingUsageSection, FeatureUsageSection, RVUsageSection } from './components';

export default function UsagePage() {
  const { data: account, status: accountStatus, refetch: accountRefetch } = useSparkPostQuery(() =>
    getAccount({ include: 'usage' }),
  );
  const { data: usage, status: usageStatus, refetch: usageRefetch } = useSparkPostQuery(getUsage);
  const {
    data: usageHistory,
    status: usageHistoryStatus,
    refetch: usageHistoryRefetch,
  } = useSparkPostQuery(getUsageHistory);
  const {
    data: subscription,
    status: subscriptionStatus,
    refetch: subscriptionRefetch,
  } = useSparkPostQuery(getSubscription);
  const isLoading =
    accountStatus === 'loading' ||
    usageStatus === 'loading' ||
    subscriptionStatus === 'loading' ||
    usageHistoryStatus === 'loading';
  const isError =
    accountStatus === 'error' ||
    usageStatus === 'error' ||
    subscriptionStatus === 'error' ||
    usageHistoryStatus === 'error';

  function handleReload() {
    accountRefetch();
    usageRefetch();
    usageHistoryRefetch();
    subscriptionRefetch();
  }

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <Page title="Usage">
        <ApiErrorBanner
          message="Sorry, we seem to be having trouble loading this page."
          reload={handleReload}
        />
      </Page>
    );
  }

  // Merging data so existing selectors can work together to grab from a common object
  const data = { account, subscription, usage, usageHistory };
  const endOfBillingPeriod = selectEndOfBillingPeriod(data);
  const startOfBillingPeriod = selectStartOfBillingPeriod(data);
  const accountUsage = data.account.usage;
  const accountSubscription = data.account.subscription;
  const billingSubscription = data.subscription;
  const rvUsage = data.usage.recipient_validation;
  const messagingUsageHistory = data.usageHistory.messaging;

  return (
    <Page title="Usage">
      <Layout>
        <MessagingUsageSection
          usage={accountUsage}
          messagingUsageHistory={messagingUsageHistory}
          subscription={accountSubscription}
          endOfBillingPeriod={endOfBillingPeriod}
          startOfBillingPeriod={startOfBillingPeriod}
        />
      </Layout>

      <Layout>
        <FeatureUsageSection billingSubscription={billingSubscription} />
      </Layout>

      {rvUsage ? (
        <Layout>
          <RVUsageSection rvUsage={rvUsage} />
        </Layout>
      ) : null}
    </Page>
  );
}
