import React, { Component } from 'react';
import classnames from 'classnames';
import styles from './SparkPost.module.scss';

/* SparkPost.Logo: Full SparkPost logo
 * SparkPost.Icon: Just the flame
 * type: 'muted' | 'white' | 'halfWhite'
 */

// See https://css-tricks.com/accessible-svgs/ for a11y information regarding labelling

const Logo = ({ type, className, ...rest }) => (
  <svg
    {...rest}
    role="img"
    aria-labelledby="sparkpost-full-logo-title"
    className={classnames(className, styles.Logo, type && styles[type])}
    height="100%"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 499 130"
  >
    <title id="sparkpost-full-logo-title">SparkPost</title>

    <path
      className={styles.Base}
      d="M.8 115.6l7.8-9.3c5.4 4.4 11 7.3 17.8 7.3 5.4 0 8.6-2.1 8.6-5.6v-.2c0-3.3-2.1-5-12-7.6-12-3.1-19.8-6.4-19.8-18.3v-.2c0-10.8 8.7-18 20.9-18 8.7 0 16.1 2.7 22.2 7.6l-6.8 9.9C34.2 77.5 29 75.3 24 75.3s-7.7 2.3-7.7 5.2v.2c0 3.9 2.6 5.2 12.9 7.9 12.1 3.2 19 7.5 19 17.9v.2c0 11.9-9 18.5-21.9 18.5-9.2 0-18.3-3.2-25.5-9.6zM56.2 64.6h24.4c14.3 0 22.9 8.5 22.9 20.7v.2c0 13.8-10.8 21-24.2 21h-10v17.9H56.2V64.6zm23.5 30.1c6.6 0 10.4-3.9 10.4-9.1v-.2c0-5.9-4.1-9-10.7-9H69.3v18.3h10.4zM122.1 64.1h12.1l25.6 60.2h-13.7l-5.5-13.4h-25.3l-5.5 13.4H96.5l25.6-60.2zm13.8 35.2L128 79.9l-8 19.4h15.9zM166 64.6h27.3c7.6 0 13.5 2.1 17.4 6.1 3.3 3.3 5.1 8 5.1 13.7v.2c0 9.6-5.2 15.7-12.8 18.5l14.6 21.3h-15.4l-12.8-19.1h-10.3v19.1H166V64.6zm26.5 29c6.4 0 10.1-3.4 10.1-8.5V85c0-5.6-3.9-8.5-10.3-8.5h-13.1v17.2h13.3zM285.8 64.6h21.7c13.1 0 22.2 6.7 22.2 18.3v.1c0 12.6-10.8 19-23.3 19h-16.1v22.3h-4.4V64.6zM306.6 98c11.1 0 18.6-5.8 18.6-14.7v-.2c0-9.5-7.3-14.4-18.1-14.4h-16.9V98h16.4zM400.8 115.6l2.9-3.3c6.6 6.1 12.6 8.9 21.4 8.9 9 0 15.1-5 15.1-11.9v-.2c0-6.3-3.3-10-16.9-12.7-14.3-2.9-20.1-7.8-20.1-16.8v-.2c0-8.9 8.1-15.7 19.2-15.7 8.7 0 14.4 2.4 20.5 7.3l-2.8 3.5c-5.6-4.9-11.3-6.7-17.8-6.7-8.8 0-14.6 5-14.6 11.3v.2c0 6.3 3.2 10.2 17.4 13.1 13.8 2.8 19.6 7.8 19.6 16.5v.2c0 9.6-8.3 16.3-19.8 16.3-9.6-.2-16.9-3.4-24.1-9.8zM470.3 68.7h-20.8v-4.1h46.1v4.1h-20.8v55.7h-4.4V68.7zM238 89.7l20.7-25.1h16L250.5 93l26 31.4h-16.9L238 97.7v26.7h-13.1V64.6H238v25.1z"
    />

    <path
      className={styles.Flame}
      d="M387.1 51c-6.7 5-7.9 13.9-8.1 19.9-10.5-12.2 19.5-48-14.6-70.1 21.1 27.3-30 54.2-30 94.4 0 15.8 9.9 29.7 31.5 34.5 21.2-4.5 31.7-18.7 31.7-34.5 0-23.6-14.7-31.4-10.5-44.2zm-21.2 65.8c-11.6 0-20.9-9.4-20.9-20.9 0-11.6 9.4-20.9 20.9-20.9 11.6 0 20.9 9.4 20.9 20.9 0 11.5-9.3 20.9-20.9 20.9z"
    />
  </svg>
);

const Icon = ({ type, className, ...rest }) => (
  <svg
    {...rest}
    role="img"
    aria-labelledby="sparkpost-logo-mark-title"
    className={classnames(className, styles.Icon, type && styles[type])}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 127.5 260"
  >
    <title id="sparkpost-logo-mark-title">SparkPost Flame Icon</title>

    <path
      className={styles.Flame}
      d="M106.5 101.3c-13.4 10.1-16 28-16.4 40.1C68.8 116.8 129.3 44.6 60.6 0 103.1 55.1 0 109.3 0 190.4c0 31.8 19.9 59.9 63.5 69.6 42.8-9.1 64-37.8 64-69.6 0-47.4-29.5-63.3-21-89.1zM63.6 234c-23.3 0-42.2-18.9-42.2-42.2 0-23.3 18.9-42.2 42.2-42.2 23.3 0 42.2 18.9 42.2 42.2.1 23.3-18.8 42.2-42.2 42.2z"
    />
  </svg>
);

class SparkPost extends Component {
  static Logo = Logo;
  static Icon = Icon;
}

export default SparkPost;
