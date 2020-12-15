import React from 'react';
import styled from 'styled-components';
import { getDeliverability } from 'src/helpers/api/metrics';
import { getMetricsFromKeys, getFilterByComparison } from 'src/helpers/metrics';
import { LegendCircle, Unit } from 'src/components';
import Divider from 'src/components/divider';
import { Box, Columns, Column, LabelValue, Stack } from 'src/components/matchbox';
import { useSparkPostQuery, usePrepareReportBuilderQuery } from 'src/hooks';

const MetricsGrid = styled.div`
  display: inline-grid;
  width: 100%;
  grid-gap: ${props => props.theme.space['200']};
  grid-template-columns: repeat(4, 1fr);
`;

export default function CompareByAggregatedRow({ comparison, reportOptions, hasDivider }) {
  const requestParams = usePrepareRequestParams({ comparison, reportOptions });
  const { data, status } = useSparkPostQuery(() => getDeliverability(requestParams), {
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
      <Columns>
        <Column width={1 / 6}>
          <LabelValue dark>
            <LabelValue.Label>{comparison.type}</LabelValue.Label>

            <LabelValue.Value>{comparison.value}</LabelValue.Value>
          </LabelValue>
        </Column>

        {hasMetrics ? (
          <Column>
            <MetricsGrid>
              {aggregatedMetrics.map((metric, metricIndex) => {
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
              })}
            </MetricsGrid>
          </Column>
        ) : null}
      </Columns>

      {hasDivider ? <Divider /> : null}
    </Stack>
  );
}

/**
 * Prepares network request parameters based on existing report state and the current comparison.
 *
 * @param {Object} comparison - comparison stemming from a user's selection of active comparisons. Used to derive a relevant network request for this particular comparison.
 * @param {Object} reportOptions - `reportOptions` derived from report builder state.
 *
 */
function usePrepareRequestParams({ comparison, reportOptions }) {
  const existingFilters = reportOptions.query_filters ? reportOptions.query_filters : [];
  const comparisonFilter = getFilterByComparison(comparison);
  const params = usePrepareReportBuilderQuery({
    ...reportOptions,
    filters: [...existingFilters, comparisonFilter],
  });

  return params;
}
