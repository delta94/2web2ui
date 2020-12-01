import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useQueryCache } from 'react-query';
import { refresh, logout } from 'src/actions/auth';
import { useRefreshToken } from 'src/helpers/http';
import { showAlert } from 'src/actions/globalAlert';
import { fetch as fetchAccount } from 'src/actions/account';

export default function useSparkPostQuery(queryFn, config = {}) {
  const queryCache = useQueryCache();
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const { url, method, params, headers } = queryFn();
  // See: https://react-query.tanstack.com/docs/guides/queries#query-keys
  // Generate a unique queryKey based on passed in query function values
  const queryKey = [url, { method, params, headers, auth }];

  // And: https://react-query.tanstack.com/docs/api#usequery
  return useQuery({
    queryKey,
    config: {
      // Pass in a custom handler for handling errors
      onError: error => handleError({ error, method, queryCache, auth, dispatch }),
      // Allow config overriding on a case-by-case basis, for any value not manually updated,
      // `react-query` defaults are used.
      ...config,
    },
  });
}

function handleError({ error, method, queryCache, auth, dispatch }) {
  const { response = {} } = error;
  const apiError = _.get(response, 'data.errors[0]', {});

  const message =
    apiError.description ||
    apiError.message ||
    'You may be having network issues or an adblocker may be blocking part of the app.';

  if (response.status === 401 && auth.refreshToken) {
    // Invalidate any in-progress queries
    queryCache.invalidateQueries();

    return (
      // This isn't actually a hook 🤔
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useRefreshToken(auth.refreshToken) // eslint-disable-line react-hooks/rules-of-hooks
        // dispatch a refresh action to save new token results in cookie and store
        .then(({ data } = {}) => dispatch(refresh(data.access_token, auth.refreshToken)))

        // dispatch the original action again, now that we have a new token ...
        // if anything in this refresh flow blew up, log out
        .then(
          // refresh token request succeeded
          async () => {
            // Refetch queries when the refresh token is successful
            // See: https://react-query.tanstack.com/docs/api/#querycacherefetchqueries
            return await queryCache.refetchQueries();
          },
          // refresh token request failed
          err => {
            dispatch(logout());
            throw err;
          },
        )
    );
  }

  if (response.status === 401) {
    return dispatch(logout());
  }

  if (response.status === 403) {
    return dispatch(fetchAccount());
  }

  // No messaging necessary for 404 errors for "GET" requests
  if (response.status === 404 && method === 'GET') {
    return;
  }

  // This error handling could be handled on the server, however, the effort required to do so was significantly larger than handling it here
  if (response.status === 413) {
    return dispatch(
      showAlert({
        type: 'error',
        message: 'Something went wrong.',
        details: 'File size larger than the server allows.',
      }),
    );
  }

  return dispatch(
    showAlert({
      type: 'error',
      message: 'Something went wrong.',
      details: message,
    }),
  );
}
