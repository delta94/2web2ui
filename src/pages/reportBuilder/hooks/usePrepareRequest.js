import { useMemo } from 'react';
import {
  getMetricsFromKeys,
  getQueryFromOptionsV2 as getQueryFromOptions,
} from 'src/helpers/metrics';

/**
 * Prepares options for requests based on the current state of the page
 */
export default function usePrepareReportBuilderQuery(reportOptions) {
  const { metrics } = reportOptions;
  const formattedMetrics = useMemo(() => {
    return getMetricsFromKeys(metrics, true);
  }, [metrics]);
  const formattedOptions = useMemo(() => {
    return getQueryFromOptions({
      ...reportOptions,
      metrics: formattedMetrics,
    });
  }, [reportOptions, formattedMetrics]);

  return formattedOptions;
}
