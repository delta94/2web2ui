import React, { useEffect } from 'react';
import { Unit, LegendCircle } from 'src/components';
import { Box, Grid, LabelValue, Inline } from 'src/components/matchbox';
import { _getAggregateDataReportBuilder as getAggregateData } from 'src/actions/summaryChart';
import { useDispatch, useSelector } from 'react-redux';
import { usePrevious } from 'src/hooks';
import _ from 'lodash';

const MetricDefinition = ({ label, children }) => {
  return (
    <LabelValue>
      <LabelValue.Label>
        <Box color="gray.600">{label}</Box>
      </LabelValue.Label>
      <LabelValue.Value>
        <Box color="white">{children}</Box>
      </LabelValue.Value>
    </LabelValue>
  );
};

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
          <Box id="date">
            <MetricDefinition label="Date">
              <Unit value={dateValue} />
            </MetricDefinition>
          </Box>
        </Grid.Column>
        <Grid.Column sm={9}>
          <Inline space="600">
            {chart.aggregateData.map(({ key, label, value, unit }) => {
              const stroke = processedMetrics.find(({ key: newKey }) => {
                return newKey === key;
              })?.stroke;
              return (
                <Box marginRight="600" key={key}>
                  <MetricDefinition label={label}>
                    <Box display="flex" alignItems="center">
                      {stroke && <LegendCircle marginRight="200" color={stroke} />}
                      <Unit value={value} unit={unit} />
                    </Box>
                  </MetricDefinition>
                </Box>
              );
            })}
          </Inline>
        </Grid.Column>
      </Grid>
    </Box>
  );
}
