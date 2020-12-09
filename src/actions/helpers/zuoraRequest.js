import requestHelperFactory from './requestHelperFactory';
import _ from 'lodash';
import { zuora as zuoraAxios } from 'src/helpers/axiosInstances';
import ErrorTracker from 'src/helpers/errorTracker';
import ZuoraApiError from 'src/helpers/zuoraApiError';
import { showAlert } from 'src/actions/globalAlert';

const onFail = ({ types, err, dispatch, meta }) => {
  const apiError = new ZuoraApiError(err);
  const { message, response } = apiError;

  dispatch({
    type: types.FAIL,
    payload: { error: apiError, message, response },
    meta,
  });

  // auto alert all errors
  dispatch(showAlert({ type: 'error', message }));

  // TODO: 'return' err once we unchain all actions
  ErrorTracker.addRequestContextAndThrow(types.FAIL, response, apiError);
};

const onSuccess = ({ types, response, dispatch, meta }) => {
  if (!response.data.success) {
    // mocking axios err that would normally be thrown when an error occurs
    const err = new Error('Something went wrong!');
    err.response = response;
    onFail({ dispatch, err, meta, types });
  }

  dispatch({
    type: types.SUCCESS,
    payload: response,
    meta,
  });

  return meta.onSuccess ? dispatch(meta.onSuccess({ results: response })) : response;
};

export default requestHelperFactory({
  request: zuoraAxios,
  onSuccess,
  onFail,
});
