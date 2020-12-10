import React from 'react';
import { useSparkPostQuery } from 'src/hooks';
import { ApiErrorBanner, Loading } from 'src/components';
import {
  getMetricsFromKeys,
  getQueryFromOptionsV2 as getQueryFromOptions,
} from 'src/helpers/metrics';
import {
  getBounceReasonsByDomainDeliverabilityMetrics,
  getDeliverabilityMetrics,
} from 'src/helpers/api';
import { selectReasons, selectFormattedAggregates } from 'src/selectors/bounceReport';
import { BounceReasonTable } from '../tables';
import { usePrepareRequest, usePrepareComparisonRequest } from '../../hooks';

export default function BounceReasonComparisonTab({ comparison }) {
  const { bounceReasonOptions, aggregatesOptions } = usePrepareRequestParameters(comparison);
  const reasons = useSparkPostQuery(() =>
    getBounceReasonsByDomainDeliverabilityMetrics(bounceReasonOptions),
  );
  const aggregates = useSparkPostQuery(() => getDeliverabilityMetrics(aggregatesOptions));

  {
    /* TODO: Do I need to incorporate the wrapper? */
  }
  if (reasons.status === 'loading' || aggregates.status === 'loading') {
    return <Loading minHeight="300px" />;
  }

  {
    /* TODO: handle reload */
  }
  if (aggregates.status === 'error' || aggregates.status === 'error') {
    return <ApiErrorBanner status="muted" />;
  }

  // TODO: This re-structuring is a holdover from Redux
  const formattedData = { bounceReport: { reasons: reasons.data, aggregates: aggregates.data } };
  const formattedReasons = selectReasons(formattedData);
  const formattedAggregates = selectFormattedAggregates(formattedData);

  return (
    <BounceReasonTable
      reasons={formattedReasons}
      aggregates={formattedAggregates}
      tableLoading={false}
    />
  );
}

/**
 * Prepares request parameters using common hooks, then leverages helper functions to determine which `metrics` are passed as arguments to each request.
 *
 * @param {Object} comparison - passed in comparison set by the user via the "Compare By" feature
 */
function usePrepareRequestParameters(comparison) {
  const formattedOptions = usePrepareRequest();
  const formattedOptionsWithComparison = usePrepareComparisonRequest({
    formattedOptions,
    comparison,
  });
  const REASON_METRICS = getMetricsFromKeys(['count_bounce']);
  const DELIVERABILITY_METRICS = getMetricsFromKeys([
    'count_sent',
    'count_bounce',
    'count_inband_bounce',
    'count_outofband_bounce',
    'count_admin_bounce',
    'count_targeted',
  ]);
  const bounceReasonOptions = getQueryFromOptions({
    ...formattedOptionsWithComparison,
    metrics: REASON_METRICS,
  });
  const aggregatesOptions = getQueryFromOptions({
    ...formattedOptionsWithComparison,
    metrics: DELIVERABILITY_METRICS,
  });

  return { bounceReasonOptions, aggregatesOptions };
}
