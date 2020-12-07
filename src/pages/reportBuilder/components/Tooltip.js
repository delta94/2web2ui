import React from 'react';
import { Box, Text } from 'src/components/matchbox';
import { LegendCircle } from 'src/components';
import { tokens } from '@sparkpost/design-tokens-hibana';

function CustomTooltip({ showTooltip, payload, label, labelFormatter, formatter }) {
  if (!showTooltip) {
    return null;
  }

  return (
    <Box borderRadius="200" padding="200" bg="gray.1000">
      <Box fontSize="100" color="gray.200" mb="100">
        {labelFormatter(label)}
      </Box>
      {payload.map(entry => (
        <Box key={`report_chart_${entry.name}`} mb="100">
          <Box justifyContent="space-between" alignItems="center" display="flex">
            <Box display="inline-flex" alignItems="center">
              <LegendCircle mr={tokens.spacing_300} color={entry.stroke} />
              <Text as="span" fontSize="100" color="white">
                {entry.name}
              </Text>
            </Box>
            <Box ml="800">
              <Text fontSize="100" textAlign="right" color="white">
                {formatter(entry.value)}
              </Text>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default CustomTooltip;
