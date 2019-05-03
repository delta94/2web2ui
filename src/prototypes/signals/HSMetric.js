import React from 'react';
import { formatDate } from 'src/helpers/date';
import { formatNumber, roundToPlaces } from 'src/helpers/units';

import styles from './HSMetric.module.scss';

function HSMetric(props) {
  return (
    <div className={styles.HSMetric}>
      <div className={styles.Date}>{formatDate(props.date)}</div>
      <h3 className={styles.Score}>{roundToPlaces(props.score, 1)}</h3>
      <h3 className={styles.Injections}>{formatNumber(props.injections)} Injections</h3>
    </div>
  )
}

export default HSMetric;
