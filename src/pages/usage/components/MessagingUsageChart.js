import React from 'react';
import LineChart from 'src/pages/reportBuilder/components/LineChart';
import { tokens } from '@sparkpost/design-tokens-hibana';
import { formatNumber } from 'src/helpers/units';
import { getTimeTickFormatter } from 'src/helpers/chart.js';

function MessagingUsageChart(props) {
  const { data } = props;

  return (
    <div>
      <LineChart
        height={200}
        lines={[{ dataKey: 'usage', stroke: tokens.color_blue_700 }]}
        data={data}
        showXAxis
        showTooltip
        xAxisKey="date"
        xTickFormatter={getTimeTickFormatter('day')}
        yTickFormatter={formatNumber}
        // tooltip={CustomTooltip}
      />
    </div>
  );
}

export default MessagingUsageChart;
