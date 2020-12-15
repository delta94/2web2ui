import React from 'react';
import { useSparkPostQuery } from 'src/hooks';
import { ApiErrorBanner, Loading } from 'src/components';
import { Panel } from 'src/components/matchbox';
import { getMetricsFromKeys, getFilterByComparison } from 'src/helpers/metrics';
import { getBounceReasonByDomain, getDeliverability } from 'src/helpers/api/metrics';
import { selectReasons, selectFormattedAggregates } from 'src/selectors/bounceReport';
import { BounceReasonTable } from '../tables';
import { usePrepareReportBuilderQuery } from 'src/hooks';
import { useReportBuilderContext } from '../../context/ReportBuilderContext';

export default function BounceReasonComparisonTab({ comparison }) {
  const [bounceReasonParams, aggregatesParams] = useRequestArguments(comparison);
  const bounceReasonsQuery = useSparkPostQuery(() => getBounceReasonByDomain(bounceReasonParams));
  const aggregatesQuery = useSparkPostQuery(() => getDeliverability(aggregatesParams));
  const isPending = bounceReasonsQuery.status === 'loading' || aggregatesQuery.status === 'loading';
  const isError = bounceReasonsQuery.status === 'error' || aggregatesQuery.status === 'error';

  function handleReload() {
    bounceReasonsQuery.refetch();
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

  // This re-structuring using the `bounceReport` key is a holdover from Redux - could we refactor these selectors to be less opinionated?
  const reasons = selectReasons({ bounceReport: { reasons: bounceReasonsQuery.data } });
  const aggregates = selectFormattedAggregates({
    bounceReport: { aggregates: aggregatesQuery.data[0] },
  });

  return <BounceReasonTable reasons={reasons} aggregates={aggregates} tableLoading={false} />;
}

/**
 * Prepares request parameters using common hooks, then leverages helper functions to determine which `metrics` are passed as arguments to each request.
 *
 * @param {Object} comparison - passed in comparison set by the user via the "Compare By" feature
 */
function useRequestArguments(comparison) {
  const { state: reportOptions } = useReportBuilderContext();
  // I borrowed this logic from `src/actions/bounceReport`
  // But does the comparison value influence which metrics are valid for this request?
  const deliverabilityMetrics = getMetricsFromKeys([
    'count_bounce',
    'count_inband_bounce',
    'count_outofband_bounce',
    'count_admin_bounce',
  ]);
  const bounceReasonMetrics = getMetricsFromKeys(['count_bounce']);
  const existingFilters = reportOptions.query_filters ? reportOptions.query_filters : [];
  const comparisonFilter = getFilterByComparison(comparison);
  const aggregatesParams = usePrepareReportBuilderQuery({
    ...reportOptions,
    filters: [...existingFilters, comparisonFilter],
    metrics: deliverabilityMetrics,
  });
  const bounceReasonParams = usePrepareReportBuilderQuery({
    ...reportOptions,
    filters: [...existingFilters, comparisonFilter],
    metrics: bounceReasonMetrics,
  });

  return [aggregatesParams, bounceReasonParams];
}
