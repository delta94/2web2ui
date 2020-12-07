import React from 'react';
import { tokens } from '@sparkpost/design-tokens-hibana';

import { formatNumber } from 'src/helpers/units';
import totalRecipientValidationCost from 'src/helpers/recipientValidation';
import { getTimeTickFormatter } from 'src/helpers/chart.js';
import LineChart from '../../reportBuilder/components/LineChart';

function RVUsageChart(props) {
  const { data } = props;

  // Calculates cost for each day and adds it to the data array
  const dataWithCost = React.useMemo(() => {
    return data.map(d => ({ ...d, cost: totalRecipientValidationCost(d.usage) }));
  }, [data]);

  return (
    <LineChart
      height={150}
      lines={[{ dataKey: 'usage', stroke: tokens.color_blue_700 }]}
      data={dataWithCost}
      showXAxis
      showTooltip
      xAxisKey="date"
      xTickFormatter={getTimeTickFormatter('day')}
      yTickFormatter={formatNumber}
    />
  );
}

export default RVUsageChart;
