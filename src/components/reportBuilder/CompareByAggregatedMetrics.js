import React, { useMemo } from 'react';
import { getDeliverabilityMetrics } from 'src/helpers/api';
import {
  getMetricsFromKeys,
  getQueryFromOptionsV2 as getQueryFromOptions,
} from 'src/helpers/metrics';
import { FilterAlt } from '@sparkpost/matchbox-icons';
import { LegendCircle, Unit } from 'src/components';
import Divider from 'src/components/divider';
import { Button, Box, Column, Columns, Inline, LabelValue, Stack } from 'src/components/matchbox';
import { useSparkPostQuery } from 'src/hooks';
import { FILTER_TYPES } from '../../pages/reportBuilder/constants';
import styled from 'styled-components';

const ViewFilterButton = styled(Button)`
  float: right;
  color: ${props => props.theme.colors.gray['600']};
`;

export default function CompareByAggregatedMetrics({
  date,
  reportOptions,
  showFiltersButton,
  handleClickFiltersButton,
}) {
  const { comparisons } = reportOptions;

  const renderDate = () => {
    return (
      <Column width={1 / 5}>
        <LabelValue dark>
          <LabelValue.Label>Date</LabelValue.Label>

          <LabelValue.Value>
            <Unit value={date} />
          </LabelValue.Value>
        </LabelValue>
      </Column>
    );
  };

  const renderAggregateData = () => {
    return (
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
    );
  };

  if (showFiltersButton)
    return (
      <Box padding="400" backgroundColor="gray.1000" data-id="compare-by-aggregated-metrics">
        <Columns>
          {renderDate()}
          <Column width={4 / 5}>
            <ViewFilterButton onClick={handleClickFiltersButton}>
              View Filters <FilterAlt size={20} />
            </ViewFilterButton>
          </Column>
        </Columns>
        <Columns>{renderAggregateData()}</Columns>
      </Box>
    );

  return (
    <Box padding="400" backgroundColor="gray.1000" data-id="compare-by-aggregated-metrics">
      <Columns>
        {renderDate()}
        {renderAggregateData()}
      </Columns>
    </Box>
  );
}

function ComparisonRow({ comparison, hasDivider, reportOptions }) {
  const { metrics } = reportOptions;
  const comparisonObj = FILTER_TYPES.find(
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
    });
  }, [reportOptions, formattedMetrics]);
  const requestOptions = {
    ...formattedOptions,
    [comparisonObj.value]: comparisonObj.value === 'subaccounts' ? comparison.id : comparison.value, // Subaccount formatting means different data must be passed to the request
  };
  const { data, status } = useSparkPostQuery(() => getDeliverabilityMetrics(requestOptions), {
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
  const hasMetrics = Boolean(formattedMetrics.length);

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
