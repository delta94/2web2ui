import React from 'react';
import {
  Bar,
  ComposedChart,
  Area,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from 'recharts';
import moment from 'moment';
import styles from './AreaChart.module.scss';
import { tokens } from '@sparkpost/design-tokens-hibana';
import _ from 'lodash';

const identity = a => a;

function orderDesc(a, b) {
  return b.value - a.value;
}

const Cursor = ({ data, height, points: [{ x, y }], width: chartWidth }) => {
  const sectionWidth = chartWidth / data.length;
  const gap = sectionWidth * 0.03;
  const width = sectionWidth - gap * 2;

  return (
    <Rectangle x={x - width / 2} y={y} height={height} width={width} fill={tokens.color_gray_400} />
  );
};

export default function AreaChart(props) {
  const renderAreas = () => {
    const { areas = [] } = props;
    return areas.map(area => {
      const areaProps = {
        strokeWidth: 2,
        animationDuration: 400,
        activeDot: false,
        dot: false,
        type: 'linear',
        ...area,
      };
      return <Area {...areaProps} />;
    });
  };

  // Manually generates X axis ticks
  const getXTicks = () => {
    const { data, precision } = props;
    let ticks;

    // Shows ticks every Sunday
    if (precision === 'day' && data.length > 15) {
      ticks = data.reduce((acc, { ts }) => {
        if (moment(ts).isoWeekday() === 7) {
          acc.push(ts);
        }
        return acc;
      }, []);
    }

    // Show ticks every 15 minutes
    if (precision === '1min') {
      ticks = data.reduce((acc, { ts }) => {
        if (moment(ts).minutes() % 15 === 0) {
          acc.push(ts);
        }
        return acc;
      }, []);
    }

    // Show ticks every 30 minutes
    if (precision === '15min') {
      ticks = data.reduce((acc, { ts }) => {
        if (moment(ts).minutes() % 30 === 0) {
          acc.push(ts);
        }
        return acc;
      }, []);
    }

    return ticks;
  };

  const {
    data,
    height,
    syncId,
    showTooltip,
    xTickFormatter = identity,
    yTickFormatter = identity,
    yScale = 'linear',
    tooltipLabelFormatter = identity,
    tooltipValueFormatter = identity,
    xAxisKey = 'ts',
    showXAxis,
    defs,
    tooltip: CustomTooltip,
    xAxisRefLines,
    yAxisRefLines,
    yLabel,
  } = props;

  return (
    <div className={styles.AreaChart}>
      <ResponsiveContainer width="99%" height={height}>
        <ComposedChart syncId={syncId} barCategoryGap="3%" data={data}>
          <Bar key="noKey" dataKey="noKey" background={{ fill: tokens.color_gray_200 }} />
          <XAxis
            axisLine={false}
            dataKey={xAxisKey}
            height={30}
            hide={!showXAxis}
            interval="preserveStartEnd"
            tickFormatter={xTickFormatter}
            tickLine={false}
            ticks={getXTicks()}
          />
          <YAxis
            axisLine={false}
            domain={['dataMin', 'dataMax']}
            interval="preserveStartEnd"
            padding={{ top: 8, bottom: 8 }}
            scale={yScale}
            tickFormatter={yTickFormatter}
            tickLine={false}
            width={60}
          />
          <Tooltip
            cursor={<Cursor data={data} />}
            content={CustomTooltip ? <CustomTooltip showTooltip={showTooltip} /> : null}
            wrapperStyle={{ zIndex: tokens.zIndex_overlay }}
            isAnimationActive={false}
            itemSorter={orderDesc}
            labelFormatter={tooltipLabelFormatter}
            formatter={tooltipValueFormatter}
          />
          {xAxisRefLines.length &&
            _.map(xAxisRefLines, (xAxisRefLine, index) => (
              <ReferenceLine
                key={`x-${index}`}
                x={xAxisRefLine.x}
                shapeRendering="crispEdges"
                stroke={xAxisRefLine.stroke}
                strokeWidth={xAxisRefLine.strokeWidth}
                strokeDasharray={xAxisRefLine.strokeDasharray}
                label={xAxisRefLine.label}
              />
            ))}
          {yAxisRefLines.length &&
            _.map(yAxisRefLines, (yAxisRefLine, index) => (
              <ReferenceLine
                key={`y-${index}`}
                y={yAxisRefLine.y}
                shapeRendering="crispEdges"
                strokeWidth={yAxisRefLine.strokeWidth}
                strokeDasharray={yAxisRefLine.strokeDasharray}
                stroke={yAxisRefLine.stroke}
              />
            ))}
          {defs ? defs : null}
          {renderAreas()}
        </ComposedChart>
      </ResponsiveContainer>
      <span className="sp-linechart-yLabel">{yLabel}</span>
    </div>
  );
}

AreaChart.defaultProps = {
  xAxisRefLines: [],
  yAxisRefLines: [],
};
