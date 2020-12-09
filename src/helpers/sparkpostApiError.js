import _ from 'lodash';

// TODO: Return an Error object as if we were to create it with class and extends Error
function SparkpostApiError(error) {
  const apiError = _.get(error, 'response.data.errors[0]', {});

  this.name = 'SparkpostApiError';
  this.stack = error.stack; // must manually assign prototype value
  this.message =
    apiError.description ||
    apiError.message ||
    (error.response
      ? error.message
      : 'You may be having network issues or an adblocker may be blocking part of the app.');

  // Intentionally assigning additional properties
  Object.assign(this, error);
}

SparkpostApiError.prototype = Object.create(Error.prototype);

export default SparkpostApiError;
