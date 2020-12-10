import React from 'react';
import { useSparkPostQuery } from 'src/hooks';
import { ApiErrorBanner, Loading } from 'src/components';
import { Panel } from 'src/components/matchbox';
import {
  getMetricsFromKeys,
  getQueryFromOptionsV2 as getQueryFromOptions,
} from 'src/helpers/metrics';
import {
  getBounceReasonsByDomainDeliverabilityMetrics,
  getDeliverabilityMetrics,
} from 'src/helpers/api';
import { selectReasons, selectFormattedAggregates } from 'src/selectors/bounceReport';
import { getRequestArgumentsFromComparison } from '../../helpers';
import { BounceReasonTable } from '../tables';
import { usePrepareQuery } from '../../hooks';

export default function BounceReasonComparisonTab({ comparison }) {
  const [reasonsArgs, aggregatesArgs] = useRequestArguments(comparison);
  const reasonsQuery = useSparkPostQuery(() =>
    getBounceReasonsByDomainDeliverabilityMetrics(reasonsArgs),
  );
  const aggregatesQuery = useSparkPostQuery(() => getDeliverabilityMetrics(aggregatesArgs));
  const isPending = reasonsQuery.status === 'loading' || aggregatesQuery.status === 'loading';
  const isError = reasonsQuery.status === 'error' || aggregatesQuery.status === 'error';

  function handleReload() {
    reasonsQuery.refetch();
    aggregatesQuery.refetch();
  }

  if (isPending) {
    return <Loading minHeight="300px" />;
  }

  if (isError) {
    return (
      <Panel.Section>
        <ApiErrorBanner reload={handleReload} status="muted" />
      </Panel.Section>
    );
  }

  // This re-structuring is a holdover from Redux - could we refactor selectors to be less opinionated?
  const formattedData = {
    bounceReport: { reasons: reasonsQuery.data, aggregates: aggregatesQuery.data },
  };
  const reasons = selectReasons(formattedData);
  const aggregates = selectFormattedAggregates(formattedData);

  return <BounceReasonTable reasons={reasons} aggregates={aggregates} tableLoading={false} />;
}

/**
 * Prepares request parameters using common hooks, then leverages helper functions to determine which `metrics` are passed as arguments to each request.
 *
 * @param {Object} comparison - passed in comparison set by the user via the "Compare By" feature
 */
function useRequestArguments(comparison) {
  const deliverabilityMetrics = getMetricsFromKeys([
    'count_bounce',
    'count_inband_bounce',
    'count_outofband_bounce',
    'count_admin_bounce',
  ]);
  const bounceReasonMetrics = getMetricsFromKeys(['count_bounce']);
  const sharedArguments = usePrepareQuery();
  const comparisonArguments = getRequestArgumentsFromComparison(comparison);
  const aggregatesArgs = {
    ...getQueryFromOptions({ ...sharedArguments, metrics: deliverabilityMetrics }),
    ...comparisonArguments,
  };
  const bounceReasonArgs = {
    ...getQueryFromOptions({ ...sharedArguments, metrics: bounceReasonMetrics }),
    ...comparisonArguments,
  };

  return [aggregatesArgs, bounceReasonArgs];
}
