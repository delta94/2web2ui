import React from 'react';
import { getDeliverability } from 'src/helpers/api/metrics';
import { getMetricsFromKeys, getFilterByComparison } from 'src/helpers/metrics';
import { LegendCircle, Unit } from 'src/components';
import Divider from 'src/components/divider';
import { Box, Column, Columns, Inline, LabelValue, Stack } from 'src/components/matchbox';
import { useSparkPostQuery, usePrepareReportBuilderQuery } from 'src/hooks';

export default function CompareByAggregatedMetrics({ date, reportOptions }) {
  const { comparisons } = reportOptions;

  return (
    <Box padding="400" backgroundColor="gray.1000" data-id="compare-by-aggregated-metrics">
      <Columns>
        <Column width={1 / 5}>
          <LabelValue dark>
            <LabelValue.Label>Date</LabelValue.Label>

            <LabelValue.Value>
              <Unit value={date} />
            </LabelValue.Value>
          </LabelValue>
        </Column>

        <Column>
          <Stack space="300">
            {comparisons.map((comparison, comparisonIndex) => {
              return (
                <ComparisonRow
                  key={`comparison-${comparisonIndex}`}
                  comparison={comparison}
                  hasDivider={comparisonIndex < comparisons.length - 1}
                  reportOptions={reportOptions}
                />
              );
            })}
          </Stack>
        </Column>
      </Columns>
    </Box>
  );
}

function ComparisonRow({ comparison, reportOptions, hasDivider }) {
  const sharedArguments = usePrepareReportBuilderQuery(reportOptions);
  const comparisonArguments = getFilterByComparison(comparison);
  const aggregatesArgs = {
    ...sharedArguments,
    ...comparisonArguments,
  };
  const { data, status } = useSparkPostQuery(() => getDeliverability(aggregatesArgs), {
    refetchOnWindowFocus: false,
  });

  if (status === 'loading' || status === 'error') return null;

  const aggregatedMetricsObj = data[0] || {};
  const aggregatedMetricsKeys = Object.keys(aggregatedMetricsObj);
  const aggregatedMetrics = getMetricsFromKeys(aggregatedMetricsKeys, true).map(metric => {
    return {
      value: aggregatedMetricsObj[metric.key],
      ...metric,
    };
  });
  const hasMetrics = Boolean(aggregatedMetrics.length);

  return (
    <Stack>
      <Inline space="600">
        <LabelValue dark>
          <LabelValue.Label>{comparison.type}</LabelValue.Label>

          <LabelValue.Value>{comparison.value}</LabelValue.Value>
        </LabelValue>

        {hasMetrics
          ? aggregatedMetrics.map((metric, metricIndex) => {
              const { label, key, stroke, unit, value } = metric;

              return (
                <Stack key={`aggregated-metric-${key}-${metricIndex}`}>
                  <LabelValue dark>
                    <LabelValue.Label>{label}</LabelValue.Label>

                    <LabelValue.Value>
                      <Box display="flex" alignItems="center">
                        {stroke ? <LegendCircle marginRight="200" color={stroke} /> : null}
                        <Unit value={value} unit={unit} />
                      </Box>
                    </LabelValue.Value>
                  </LabelValue>
                </Stack>
              );
            })
          : null}
      </Inline>

      {hasDivider ? <Divider /> : null}
    </Stack>
  );
}
