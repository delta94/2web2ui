import { useMemo } from 'react';
import {
  getMetricsFromKeys,
  getQueryFromOptionsV2 as getQueryFromOptions,
} from 'src/helpers/metrics';
import { useReportBuilderContext } from '../context/ReportBuilderContext';

/**
 * Prepares options for requests based on the current state of the page
 */
export default function usePrepareComparisonRequest() {
  const { state: reportOptions } = useReportBuilderContext();
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
