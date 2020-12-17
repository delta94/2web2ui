import React from 'react';
import styled from 'styled-components';
import { Unit } from 'src/components';
import { Box, Column, Columns, LabelValue, Stack } from 'src/components/matchbox';
import CompareByAggregatedRow from './CompareByAggregatedRow';
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
      <Column width={showFiltersButton ? 2 / 5 : 1 / 5} mb={showFiltersButton && '200'}>
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
              <CompareByAggregatedRow
                key={`comparison-${comparisonIndex}`}
                comparison={comparison}
                reportOptions={reportOptions}
                hasDivider={comparisonIndex < comparisons.length - 1}
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
