import React from 'react';
import PropTypes from 'prop-types';
import useHibanaToggle from 'src/hooks/useHibanaToggle';
import { Heading } from 'src/components/text';
import { Box, Stack, Text } from 'src/components/matchbox';
import styles from './Empty.module.scss';

function OGEmpty({ message }) {
  return (
    <Heading as="h6" className={styles.Message}>
      {message}
    </Heading>
  );
}

function HibanaEmpty({ description, message }) {
  return (
    <Box
      paddingTop="800"
      paddingRight="500"
      paddingBottom="800"
      paddingLeft="500"
      textAlign="center"
      backgroundColor="gray.200"
      display="flex"
      alignItems="center"
      justifyContent="center"
      size="100%"
    >
      <Stack space="0">
        <Text color="gray.900" fontSize="400" fontWeight="medium">
          {message}
        </Text>
        {description && (
          <Text color="gray.900" fontSize="400" fontWeight="normal">
            {description}
          </Text>
        )}
      </Stack>
    </Box>
  );
}

function Empty(props) {
  return useHibanaToggle(OGEmpty, HibanaEmpty)(props);
}

Empty.propTypes = {
  message: PropTypes.string.isRequired,
  description: PropTypes.string,
};

export default Empty;
