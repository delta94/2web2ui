import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Loading } from 'src/components/loading';
import { Panel } from 'src/components/matchbox';
import styles from './PanelLoading.module.scss';

const StyledPanel = styled.div`
  min-height: ${props => props.minHeight};
`;

const PanelLoading = props => {
  const { minHeight, accent, title, as = Panel.LEGACY } = props;

  return (
    <StyledPanel
      as={as}
      className={styles.Loading}
      accent={accent}
      data-id="panel-loading"
      title={title}
      minHeight={minHeight}
    >
      <Loading minHeight={minHeight} />
    </StyledPanel>
  );
};

PanelLoading.propTypes = {
  minHeight: PropTypes.string,
  accent: PropTypes.bool,
};

PanelLoading.defaultProps = {
  minHeight: '400px',
  accent: false,
};

export default PanelLoading;
