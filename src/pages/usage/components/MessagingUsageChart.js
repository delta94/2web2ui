import React from 'react';
import LineChart from 'src/pages/reportBuilder/components/LineChart';
import { tokens } from '@sparkpost/design-tokens-hibana';
import { formatNumber } from 'src/helpers/units';
import { getTimeTickFormatter } from 'src/helpers/chart.js';

function renderCustomDefs() {
  return (
    <defs>
      <linearGradient id="strokeColor" x1="0%" y1="0" x2="100%" y2="0">
        <stop offset="0%" stopColor={tokens.color_blue_700} />
        <stop offset="80%" stopColor={tokens.color_blue_700} />
        <stop offset="80%" stopColor={tokens.color_yellow_400} />
        <stop offset="100%" stopColor={tokens.color_yellow_400} />
      </linearGradient>
      <linearGradient id="fillColor" x1="0%" y1="0" x2="100%" y2="0">
        <stop offset="0%" stopColor={tokens.color_blue_400} />
        <stop offset="80%" stopColor={tokens.color_blue_400} />
        <stop offset="80%" stopColor={tokens.color_yellow_200} />
        <stop offset="100%" stopColor={tokens.color_yellow_200} />
      </linearGradient>
    </defs>
  );
}

function MessagingUsageChart(props) {
  const { data } = props;

  return (
    <div>
      <LineChart
        height={200}
        areas={[{ dataKey: 'usage', stroke: 'url(#strokeColor)', fill: 'url(#fillColor)' }]}
        data={data}
        showXAxis
        showTooltip
        xAxisKey="date"
        xTickFormatter={getTimeTickFormatter('day')}
        yTickFormatter={formatNumber}
        defs={renderCustomDefs()}
        referenceLine={{ y: 150000000, stroke: tokens.color_gray_800, strokeDasharray: '3 3' }}
        // tooltip={CustomTooltip}
      />
    </div>
  );
}

export default MessagingUsageChart;
