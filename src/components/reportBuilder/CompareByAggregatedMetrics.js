import React from 'react';
import { Unit } from 'src/components';
import { Box, Column, Columns, LabelValue, Stack } from 'src/components/matchbox';
import CompareByAggregatedRow from './CompareByAggregatedRow';

export default function CompareByAggregatedMetrics({ date, reportOptions }) {
  const { comparisons } = reportOptions;

  return (
    <Box padding="400" backgroundColor="gray.1000" data-id="compare-by-aggregated-metrics">
      <Columns collapseBelow="md">
        <Column width={1 / 6}>
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
      </Columns>
    </Box>
  );
}
