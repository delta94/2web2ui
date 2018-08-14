import moment from 'moment';
import config from 'src/config';
import { roundBoundaries } from './metrics';
import { FORMATS } from 'src/constants';

export const relativeDateOptions = [
  { value: 'hour', label: 'Last Hour' },
  { value: 'day', label: 'Last 24 Hours' },
  { value: '7days', label: 'Last 7 Days' },
  { value: '10days', label: 'Last 10 Days' },
  { value: '30days', label: 'Last 30 Days' },
  { value: '90days', label: 'Last 90 Days' },
  { value: 'custom', label: 'Custom' }
];

export const relativeDateOptionsIndexed = relativeDateOptions.reduce((result, { value, label }) => {
  result[value] = label;
  return result;
}, {});

export const getRelativeDateOptions = (ranges) => relativeDateOptions.filter((item) => ranges.includes(item.value));
/**
 * Takes a date string and returns the end of that day (11:59PM)
 *
 * If preventFuture is true and the given day IS the current day,
 * it returns the current time, i.e. the closest to the end
 * of the day without going into the future.
 *
 * @param {String} date - date string to base date on
 * @return {Date}
 */
export function getEndOfDay(date, { preventFuture } = {}) {
  const now = moment();
  const end = new Date(date);

  if (preventFuture && now.isSame(end, 'day')) {
    return now.toDate();
  }

  end.setHours(23, 59, 59, 999);
  return end;
}

export function getStartOfDay(date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

export function isSameDate(a, b) {
  return (a instanceof Date) && (b instanceof Date) && (a.getTime() === b.getTime());
}

/**
 * Use native JS methods to get user's local
 * timezone, if those methods are present
 *
 * Defaults to UTC otherwise
 */
export function getLocalTimezone() {
  // eslint-disable-next-line new-cap
  if (typeof Intl === 'undefined' || typeof Intl.DateTimeFormat !== 'function') {
    return 'UTC';
  }

  // eslint-disable-next-line new-cap
  const format = Intl.DateTimeFormat();

  if (typeof format.resolvedOptions !== 'function') {
    return 'UTC';
  }

  return format.resolvedOptions().timeZone;
}

export function getRelativeDates(range) {
  const now = moment().toDate();
  let preciseFrom;

  switch (range) {
    case 'hour':
      preciseFrom = moment(now).subtract(1, 'hour').toDate();
      break;

    case 'day':
      preciseFrom = moment(now).subtract(1, 'day').toDate();
      break;

    case '7days':
      preciseFrom = moment(now).subtract(7, 'day').toDate();
      break;

    case '10days':
      preciseFrom = moment(now).subtract(10, 'day').toDate();
      break;

    case '30days':
      preciseFrom = moment(now).subtract(30, 'day').toDate();
      break;

    case '90days':
      preciseFrom = moment(now).subtract(90, 'day').toDate();
      break;

    case 'custom':
      return { relativeRange: range };

    default: {
      if (range) {
        throw new Error(`Tried to calculate a relative date range with an invalid range value: ${range}`);
      }
      return {};
    }
  }

  const { to, from } = roundBoundaries(preciseFrom, now);
  return { to: to.toDate(), from: from.toDate(), relativeRange: range };
}

export function getDuration(dates, unit = 'hours') {
  const { from, to } = dates;
  return moment(to).diff(moment(from), unit);
}

export function formatDate(date, FORMAT = config.dateFormat) {
  return moment(date).format(FORMAT);
}

export function formatTime(time, FORMAT = config.timeFormat) {
  return moment(time).format(FORMAT);
}

export function formatDateTime(datetime) {
  return `${formatDate(datetime)}, ${formatTime(datetime)}`;
}

export const formatInputDate = (date) => moment(date).format(FORMATS.SHORT_DATE);
export const formatInputTime = (time) => moment(time).format(FORMATS.TIME);
export const parseDate = (str) => moment(str, FORMATS.INPUT_DATES, true);
export const parseTime = (str) => moment(str, FORMATS.INPUT_TIMES, true);
export const parseDatetime = (...args) => moment(args.join(' '), FORMATS.INPUT_DATETIMES, true);
