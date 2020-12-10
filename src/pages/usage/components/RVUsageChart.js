import React from 'react';
import { Box, Text } from 'src/components/matchbox';
import { tokens } from '@sparkpost/design-tokens-hibana';
import { LegendCircle } from 'src/components';
import { formatNumber } from 'src/helpers/units';
import { fillByDate } from 'src/helpers/date';
import totalRecipientValidationCost from 'src/helpers/recipientValidation';
import { getTimeTickFormatter, getTooltipLabelFormatter } from 'src/helpers/chart.js';
import LineChart from 'src/components/charts/LineChart';

export function CustomTooltip(props) {
  const { payload, label } = props;

  // There is only ever one line in this chart, so we just pick the first entry
  const entry = payload[0] || {};

  return (
    <Box borderRadius="200" padding="200" bg="gray.1000">
      <Box fontSize="100" color="gray.200" mb="100">
        {getTooltipLabelFormatter('day')(label)}
      </Box>
      <Box>
        <Box justifyContent="space-between" alignItems="center" display="flex">
          <Box display="inline-flex" alignItems="center">
            <LegendCircle mr={tokens.spacing_300} color={tokens.color_blue_700} />
            <Text as="span" fontSize="100" color="white">
              Validations
            </Text>
          </Box>
          <Box ml="800">
            <Text fontSize="100" textAlign="right" color="white">
              {formatNumber(entry.value)}
            </Text>
          </Box>
        </Box>
      </Box>
      <Box>
        <Box justifyContent="space-between" alignItems="center" display="flex">
          <Box display="inline-flex" alignItems="center">
            <Text as="span" fontSize="100" color="white">
              Expenses
            </Text>
          </Box>
          <Box ml="800">
            <Text fontSize="100" textAlign="right" color="white">
              {totalRecipientValidationCost(entry.value)}
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function RVUsageChart(props) {
  const { data, end, start } = props;

  const filledData = React.useMemo(() => {
    return fillByDate({ dataSet: data, from: start, to: end });
  }, [data, start, end]);

  return (
    <LineChart
      height={200}
      lines={[{ dataKey: 'usage', stroke: tokens.color_blue_700 }]}
      data={filledData}
      showXAxis
      showTooltip
      xAxisKey="date"
      xTickFormatter={getTimeTickFormatter('day')}
      yTickFormatter={formatNumber}
      tooltip={CustomTooltip}
      yLabel="Validations"
    />
  );
}

export default RVUsageChart;
