import SparkpostApiError from 'src/helpers/sparkpostApiError';
const MAX_RETRIES = 3;
const TIMEOUT = 100;

//Interceptor for handling axios error and retry
export const sparkpostErrorHandler = axiosInstance => error => {
  const apiError = new SparkpostApiError(error); // transform Error to SparkpostApiError for detection
  const { config, response } = apiError;
  const { retries = 0 } = config;

  // Retries for any 5XX Error
  if (response && /^5\d\d/.test(String(response.status)) && retries < MAX_RETRIES) {
    return new Promise(resolve =>
      setTimeout(() => resolve(axiosInstance({ ...config, retries: retries + 1 })), TIMEOUT),
    );
  }

  return Promise.reject(apiError);
};
