import React, { useEffect } from 'react';
import { Unit, LegendCircle } from 'src/components';
import { Box, Grid, LabelValue, Inline } from 'src/components/matchbox';
import { _getAggregateDataReportBuilder as getAggregateData } from 'src/actions/summaryChart';
import { useDispatch, useSelector } from 'react-redux';
import { usePrevious } from 'src/hooks';
import _ from 'lodash';

export default function AggregateMetricsSection({ dateValue, updates, processedMetrics }) {
  const dispatch = useDispatch();
  const chart = useSelector(state => state.summaryChart);
  const previousUpdates = usePrevious(updates);

  useEffect(() => {
    if (!_.isEqual(previousUpdates, updates)) dispatch(getAggregateData(updates));
  }, [dispatch, previousUpdates, updates]);

  return (
    <Box padding="400" backgroundColor="gray.1000">
      <Grid>
        <Grid.Column sm={3}>
          <LabelValue dark>
            <LabelValue.Label>Date</LabelValue.Label>

            <LabelValue.Value>
              <Unit value={dateValue} />
            </LabelValue.Value>
          </LabelValue>
        </Grid.Column>
        <Grid.Column sm={9}>
          <Inline space="600">
            {chart.aggregateData.map(({ key, label, value, unit }) => {
              const stroke = processedMetrics.find(({ key: newKey }) => {
                return newKey === key;
              })?.stroke;

              return (
                <Box key={`aggregated-metric-${key}`}>
                  <LabelValue dark>
                    <LabelValue.Label>{label}</LabelValue.Label>

                    <LabelValue.Value>
                      <Box display="flex" alignItems="center">
                        {stroke && <LegendCircle marginRight="200" color={stroke} />}
                        <Unit value={value} unit={unit} />
                      </Box>
                    </LabelValue.Value>
                  </LabelValue>
                </Box>
              );
            })}
          </Inline>
        </Grid.Column>
      </Grid>
    </Box>
  );
}
