import { FILTER_TYPES } from '../constants';

/**
 * Prepares request options/params based on the current state of the page and the passed in comparison object.
 *
 * @param {Object} formattedOptions - formatted request options prepared by `usePrepareRequest()`
 * @param {Object} comparison - passed in comparison when the user selects comparisons via "compare by"
 */
export default function usePrepareComparisonRequest({ formattedOptions, comparison }) {
  const comparisonObj = FILTER_TYPES.find(
    comparisonConfig => comparisonConfig.label === comparison.type,
  );
  const requestOptions = {
    ...formattedOptions,
    [comparisonObj.value]: comparisonObj.value === 'subaccounts' ? comparison.id : comparison.value, // Subaccount formatting means different data must be passed to the request
  };

  return requestOptions;
}
