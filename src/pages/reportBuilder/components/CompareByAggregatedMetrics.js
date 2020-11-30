import React, { useMemo } from 'react';
import { getDeliverabilityMetrics } from 'src/helpers/api';
import {
  getMetricFromKey,
  getMetricsFromKeys,
  getQueryFromOptionsV2 as getQueryFromOptions,
} from 'src/helpers/metrics';
import { Loading, Unit } from 'src/components';
import { Definition } from 'src/components/text';
import Divider from 'src/components/divider';
import { Box, Column, Columns, Inline, Stack } from 'src/components/matchbox';
import { useSparkPostQuery } from 'src/hooks';
import { useReportBuilderContext } from '../context/ReportBuilderContext';

// TODO put this somewhere more re-usable
const COMPARISON_TYPES = [
  {
    label: 'Recipient Domain',
    value: 'domains',
  },
  {
    label: 'Sending IP',
    value: 'sending_ips',
  },
  {
    label: 'IP Pool',
    value: 'ip_pools',
  },
  {
    label: 'Campaign',
    value: 'campaigns',
  },
  {
    label: 'Template',
    value: 'templates',
  },
  {
    label: 'Sending Domain',
    value: 'sending_domains',
  },
  {
    label: 'Subaccount',
    value: 'subaccounts',
  },
];

export default function CompareByAggregatedMetrics({ date }) {
  const { state } = useReportBuilderContext();
  const { comparisons } = state;

  return (
    <Box padding="400" backgroundColor="gray.1000">
      <Columns>
        <Column width={1 / 5}>
          <Definition dark>
            <Definition.Label>Date</Definition.Label>

            <Definition.Value>
              <Unit value={date} />
            </Definition.Value>
          </Definition>
        </Column>

        <Column>
          <Stack space="300">
            {comparisons.map((comparison, comparisonIndex) => {
              return (
                <ComparisonRow
                  key={`comparison-${comparisonIndex}`}
                  comparison={comparison}
                  hasDivider={comparisonIndex < comparisons.length - 1}
                />
              );
            })}
          </Stack>
        </Column>
      </Columns>
    </Box>
  );
}

function ComparisonRow({ comparison, hasDivider }) {
  const { state: reportOptions } = useReportBuilderContext();
  const { metrics } = reportOptions;
  const comparisonObj = COMPARISON_TYPES.find(
    comparisonConfig => comparisonConfig.label === comparison.type,
  );
  // Prepares params for request
  const formattedMetrics = useMemo(() => {
    return getMetricsFromKeys(metrics, true);
  }, [metrics]);
  const formattedOptions = useMemo(() => {
    return getQueryFromOptions({
      ...reportOptions,
      metrics: formattedMetrics,
      [comparisonObj.value]: comparison.value,
    });
  }, [reportOptions, formattedMetrics, comparisonObj, comparison]);
  const { data, status } = useSparkPostQuery(() => getDeliverabilityMetrics(formattedOptions), {
    refetchOnWindowFocus: false,
  });

  if (status === 'loading') return <Loading />;

  if (status === 'error') return null;

  const aggregatedMetricsObj = data[0];
  const aggregatedMetricsKeys = Object.keys(aggregatedMetricsObj);

  return (
    <Stack>
      <Inline>
        <Definition dark>
          <Definition.Label>{comparison.type}</Definition.Label>
          <Definition.Value>{comparison.value}</Definition.Value>
        </Definition>

        {aggregatedMetricsKeys.map((metricKey, metricKeyIndex) => {
          const { label } = getMetricFromKey(metricKey);
          const value = aggregatedMetricsObj[metricKey];

          return (
            <Stack key={`metric-${metricKeyIndex}`}>
              <Definition dark>
                <Definition.Label>{label}</Definition.Label>
                <Definition.Value>{value}</Definition.Value>
              </Definition>
            </Stack>
          );
        })}
      </Inline>

      {hasDivider ? <Divider /> : null}
    </Stack>
  );
}
