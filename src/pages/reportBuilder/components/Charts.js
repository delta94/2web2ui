import React, { useMemo, useState } from 'react';
import _ from 'lodash';
import { getLineChartFormatters } from 'src/helpers/chart';
import LineChart from './LineChart';
import METRICS_UNIT_CONFIG from 'src/config/metrics-units';
import { Box, Stack, Panel } from 'src/components/matchbox';
import { useSparkPostQuery } from 'src/hooks';
import { getTimeSeriesDeliverabilityMetrics } from 'src/helpers/api';
import {
  getMetricsFromKeys,
  getQueryFromOptionsV2 as getQueryFromOptions,
  transformData,
} from 'src/helpers/metrics';
import { REPORT_BUILDER_FILTER_KEY_MAP } from 'src/constants';
import { useReportBuilderContext } from '../context/ReportBuilderContext';
import { Heading } from 'src/components/text';
import { Loading, Empty } from 'src/components';
const DEFAULT_UNIT = 'number';

function getUniqueUnits(metrics) {
  return _.uniq(metrics.map(({ unit = DEFAULT_UNIT }) => unit));
}

export default function ChartContainer() {
  const { state: reportOptions } = useReportBuilderContext();
  return <ChartGroups reportOptions={reportOptions} />;
}

export function ChartGroups(props) {
  const { reportOptions } = props;
  const { comparisons } = reportOptions;
  const hasComparisons = Boolean(comparisons.length);
  const [activeChart, setActiveChart] = useState(null);

  if (!hasComparisons) {
    return (
      <Panel.Section padding="0">
        <Charts
          activeChart={activeChart}
          setActiveChart={setActiveChart}
          id="chart"
          reportOptions={reportOptions}
        />
      </Panel.Section>
    );
  }

  return (
    <>
      {comparisons.map((compareFilter, index) => {
        const filterType = REPORT_BUILDER_FILTER_KEY_MAP[compareFilter.type];

        // Appends each compared filter as a new filter for individual requests
        const comparedFilters = [
          ...reportOptions.filters,
          { AND: { [filterType]: { eq: [compareFilter] } } },
        ];
        return (
          <Panel.Section key={`chart_group_${index}`}>
            <Stack>
              <Box>
                <Heading data-id={`heading_${index}`} as="h3" looksLike="h4">
                  {compareFilter.value}
                </Heading>
              </Box>
              <Box>
                <Charts
                  activeChart={activeChart}
                  setActiveChart={setActiveChart}
                  id={`chart_group_${index}`}
                  reportOptions={{ ...reportOptions, filters: comparedFilters }}
                />
              </Box>
            </Stack>
          </Panel.Section>
        );
      })}
    </>
  );
}

export function Charts(props) {
  const { reportOptions, activeChart, setActiveChart, id } = props;
  const { comparisons, metrics } = reportOptions;

  // Prepares params for request
  const formattedMetrics = useMemo(() => {
    return getMetricsFromKeys(metrics, true);
  }, [metrics]);
  const formattedOptions = useMemo(() => {
    return getQueryFromOptions({ ...reportOptions, metrics: formattedMetrics });
  }, [reportOptions, formattedMetrics]);
  const { precision, to } = formattedOptions;

  // API request
  const { data: rawChartData, status: chartStatus } = useSparkPostQuery(
    () => {
      return getTimeSeriesDeliverabilityMetrics(formattedOptions);
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const chartData = useMemo(() => {
    return transformData(rawChartData, formattedMetrics);
  }, [rawChartData, formattedMetrics]);

  const formatters = getLineChartFormatters(precision, to);
  //Separates the metrics into their appropriate charts
  const charts = getUniqueUnits(formattedMetrics).map(unit => ({
    metrics: formattedMetrics.filter(metric => metric.unit === unit),
    ...METRICS_UNIT_CONFIG[unit],
  }));
  let height = 150;

  switch (charts.length * (comparisons.length || 1)) {
    case 1:
      height = 400;
      break;
    case 2:
      height = 200;
      break;
    default:
      break;
  }

  if (chartStatus === 'loading' || chartStatus === 'idle') {
    return <Loading minHeight="200px" />;
  }

  if (chartStatus === 'error') {
    return <Empty message="Unable to load report" description="Please try again" />;
  }

  return (
    <Box padding={[400, null, 500]}>
      <Stack>
        {charts.map((chart, index) => (
          <Box key={`chart-${index}`} onMouseOver={() => setActiveChart(`${id}_chart_${index}`)}>
            <LineChart
              height={height}
              syncId="summaryChart"
              data={chartData}
              precision={precision}
              showTooltip={activeChart === `${id}_chart_${index}`}
              lines={chart.metrics.map(({ name, label, stroke }) => ({
                key: name,
                dataKey: name,
                name: label,
                stroke,
              }))}
              {...formatters}
              yTickFormatter={chart.yAxisFormatter}
              yLabel={chart.label}
              tooltipValueFormatter={chart.yAxisFormatter}
              showXAxis={index === charts.length - 1}
            />
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
