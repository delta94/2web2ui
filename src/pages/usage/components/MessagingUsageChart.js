import React from 'react';
import AreaChart from 'src/components/charts/AreaChart';
import { Box, Text } from 'src/components/matchbox';
import { tokens } from '@sparkpost/design-tokens-hibana';
import { formatNumber } from 'src/helpers/units';
import { getTimeTickFormatter, getTooltipLabelFormatter } from 'src/helpers/chart.js';

function MessagingUsageChart(props) {
  const { data, usage, overage } = props;

  const thresholdIndex = data.findIndex(item => {
    return item.usage >= usage.month.limit;
  });

  const thresholdPercentage = (thresholdIndex / data.length) * 100;

  const CustomTooltip = ({ showTooltip, payload, label }) => {
    if (!showTooltip) {
      return null;
    }
    return (
      <Box borderRadius="200" padding="200" bg="gray.1000">
        <Box fontSize="100" color="gray.600" mb="100">
          {getTooltipLabelFormatter('day')(label)}
        </Box>
        {payload.map(entry => (
          <Box key={`report_chart_${entry.name}`} mb="100">
            <Box justifyContent="space-between" alignItems="center" display="flex">
              <Box display="inline-flex" alignItems="center">
                <Text as="span" fontSize="100" color="white">
                  Usage
                </Text>
              </Box>
              <Box ml="800">
                <Text fontSize="100" textAlign="right" color="white">
                  {entry.value.toLocaleString()}
                </Text>
              </Box>
            </Box>
          </Box>
        ))}
        <Box key="report_chart_dailylimit" mb="100">
          <Box justifyContent="space-between" alignItems="center" display="flex">
            <Box display="inline-flex" alignItems="center">
              <Text as="span" fontSize="100" color="white">
                Daily Limit
              </Text>
            </Box>
            <Box ml="800">
              <Text fontSize="100" textAlign="right" color="white">
                {usage.day.limit.toLocaleString()}
              </Text>
            </Box>
          </Box>
        </Box>
        <Box key="report_chart_dailylimit" mb="100">
          <Box justifyContent="space-between" alignItems="center" display="flex">
            <Box display="inline-flex" alignItems="center">
              <Text as="span" fontSize="100" color="white">
                Month's Overage Total
              </Text>
            </Box>
            <Box ml="800">
              <Text fontSize="100" textAlign="right" color="white">
                {overage.toLocaleString()}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  function renderCustomDefs() {
    return (
      <defs>
        <linearGradient id="strokeColor" x1="0%" y1="0" x2="100%" y2="0">
          <stop offset="0%" stopColor={tokens.color_blue_700} />
          <stop offset={`${thresholdPercentage}%`} stopColor={tokens.color_blue_700} />
          <stop offset={`${thresholdPercentage}%`} stopColor={tokens.color_yellow_400} />
          <stop offset="100%" stopColor={tokens.color_yellow_400} />
        </linearGradient>
        <linearGradient id="fillColor" x1="0%" y1="0" x2="100%" y2="0">
          <stop offset="0%" stopColor={tokens.color_blue_400} />
          <stop offset={`${thresholdPercentage}%`} stopColor={tokens.color_blue_400} />
          <stop offset={`${thresholdPercentage}%`} stopColor={tokens.color_yellow_200} />
          <stop offset="100%" stopColor={tokens.color_yellow_200} />
        </linearGradient>
      </defs>
    );
  }

  return (
    <div>
      <AreaChart
        height={200}
        areas={[{ dataKey: 'usage', stroke: 'url(#strokeColor)', fill: 'url(#fillColor)' }]}
        data={data}
        showXAxis
        showTooltip
        tooltip={CustomTooltip}
        xAxisKey="date"
        xTickFormatter={getTimeTickFormatter('day')}
        yTickFormatter={formatNumber}
        defs={renderCustomDefs()}
        yAxisRefLines={[
          {
            y: usage.month.limit,
            stroke: tokens.color_gray_300,
            strokeDasharray: '3 3',
          },
        ]}
        yLabel="Usage"
      />
    </div>
  );
}

export default MessagingUsageChart;
