import React, { useEffect } from 'react';
import { Unit, LegendCircle } from 'src/components';
import { Box, Button, Grid, LabelValue, Inline } from 'src/components/matchbox';
import { FilterAlt } from '@sparkpost/matchbox-icons';
import { _getAggregateDataReportBuilder as getAggregateData } from 'src/actions/summaryChart';
import { useDispatch, useSelector } from 'react-redux';
import { usePrevious } from 'src/hooks';
import _ from 'lodash';
import styled from 'styled-components';

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

const ViewFilterButton = styled(Button)`
  float: right;
  color: ${props => props.theme.colors.gray['600']};
`;

export default function AggregateMetricsSection({
  dateValue,
  updates,
  processedMetrics,
  showFiltersButton,
  handleClickFiltersButton,
}) {
  const dispatch = useDispatch();
  const chart = useSelector(state => state.summaryChart);
  const previousUpdates = usePrevious(updates);

  useEffect(() => {
    if (!_.isEqual(previousUpdates, updates)) dispatch(getAggregateData(updates));
  }, [dispatch, previousUpdates, updates]);

  return (
    <Box padding="400" backgroundColor="gray.1000">
      <Grid>
        <Grid.Column sm={showFiltersButton ? 9 : 3}>
          <Box id="date">
            <MetricDefinition label="Date">
              <Unit value={dateValue} />
            </MetricDefinition>
          </Box>
        </Grid.Column>
        {showFiltersButton && (
          <>
            <Grid.Column sm={3}>
              <ViewFilterButton onClick={handleClickFiltersButton}>
                View Filters <FilterAlt size={20} />
              </ViewFilterButton>
            </Grid.Column>
            <Box height="300" width="100%">
              &nbsp;
            </Box>
          </>
        )}
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
