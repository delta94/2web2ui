import _ from 'lodash';
import { stripTags } from 'src/helpers/string';

// TODO: Return an Error object as if we were to create it with class and extends Error
function ZuoraApiError(error) {
  const message = error.response
    ? _.get(
        error.response,
        'data.reasons[0].message',
        'An error occurred while contacting the billing service',
      )
    : 'You may be having network issues or an adblocker may be blocking part of the app.';

  this.name = 'ZuoraApiError';
  this.stack = error.stack; // must manually assign prototype value
  this.message = stripTags(message); // some messages include html tags

  // Intentionally assigning additional properties
  Object.assign(this, error);
}

ZuoraApiError.prototype = Object.create(Error.prototype);

export default ZuoraApiError;
