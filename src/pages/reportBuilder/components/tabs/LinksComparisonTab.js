import React from 'react';
import { useSparkPostQuery } from 'src/hooks';
import { ApiErrorBanner, Loading } from 'src/components';
import { Panel } from 'src/components/matchbox';
import { getMetricsFromKeys, getFilterByComparison } from 'src/helpers/metrics';
import { getEngagement, getDeliverability } from 'src/helpers/api/metrics';
import { LinksTable } from '../tables';
import { useReportBuilderContext } from '../../context/ReportBuilderContext';
import { usePrepareReportBuilderQuery } from 'src/hooks';

export default function LinksComparisonTab({ comparison }) {
  const [aggregatesArgs, linkArgs] = useRequestArguments(comparison);
  const linksQuery = useSparkPostQuery(() => getEngagement(linkArgs));
  const aggregatesQuery = useSparkPostQuery(() => getDeliverability(aggregatesArgs));
  const isPending = linksQuery.status === 'loading' || aggregatesQuery.status === 'loading';
  const isError = linksQuery.status === 'error' || aggregatesQuery.status === 'error';

  function handleReload() {
    linksQuery.refetch();
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

  return (
    <LinksTable
      links={linksQuery.data}
      totalClicks={aggregatesQuery.data.count_clicked}
      tableLoading={false}
    />
  );
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
    'count_accepted',
    'count_clicked',
    'count_sent',
    'count_unique_clicked_approx',
    'count_unique_confirmed_opened_approx',
  ]);
  const linkMetrics = getMetricsFromKeys(['count_clicked', 'count_raw_clicked_approx']);
  const existingFilters = reportOptions.filters ? reportOptions.filters : [];
  const comparisonFilter = getFilterByComparison(comparison);

  const aggregatesArgs = usePrepareReportBuilderQuery({
    ...reportOptions,
    filters: [...existingFilters, comparisonFilter],
    metrics: deliverabilityMetrics,
  });
  const linkArgs = usePrepareReportBuilderQuery({
    ...reportOptions,
    filters: [...existingFilters, comparisonFilter],
    metrics: linkMetrics,
  });

  return [aggregatesArgs, linkArgs];
}
