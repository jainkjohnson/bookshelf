import endpoints from 'src/config/endpoints';
import { getUrlWithQueryParams } from 'src/utils/routing';

const { apiRoot } = endpoints;

/**
 * Generate credentials
 * @param {String} credentials
 * @returns {String}
 */
function generateCredentials(credentials) {
  if (credentials) {
    return [
      'omit',
      'include',
      'same-origin',
    ].indexOf(credentials) === -1 ? 'include' : credentials;
  }

  return 'same-origin';
}

/**
 * Construct request endpoint URL
 * @param {Object} params - query parameters used in API call
 * @param {String} endpoint - API endpoint
 * @param {String} host - API base path to override default `apiRoot`
 * @returns {String}
 */
export function getReqUrl({ params, endpoint, host }) {
  const base = host || apiRoot || '';
  const url = `${base}/${endpoint}`;

  return params ? getUrlWithQueryParams(url, params) : url;
}

/**
 * Construct the options object containing any custom settings
 * that you want to apply to the request.
 * Refer `init` object doc:
 * developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
 * @param {String} method - REST API method
 * @param {Object} headers - request header props
 * @returns {Object}
*/
export function getReqOptions(method, { headers, body, credentials }) {
  const requestOptions = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: generateCredentials(credentials),
    method,
    mode: 'cors',
  };

  if (method === 'POST' || method === 'PUT') {
    requestOptions.body = JSON.stringify(body);
  }

  return requestOptions;
}

/**
 * Parse API response
 * @param {Object} res - response object
 * @param {String} method - REST API method
 * @param {Object} params - query parameters used in API call
 * @returns {Promise}
 */
function parseResponse(res) {
  const json = res.text().then((text) => {
    try {
      return JSON.parse(text);
    } catch (error) {
      return {
        statusCode: res.status,
        ...error,
      };
    }
  });

  if (res.status >= 400) {
    // When the server response contains important JSON data for errors
    return json.then((error) => ({
      ...error,
      endpoint: res.url,
      statusCode: res.status,
    })).then(Promise.reject.bind(Promise));
  }

  return json;
}

/**
 * This function process the error when the server is down or there's no
 * connectivity available. It also process all other errors, but does not
 * do anything special for those.
 */
function handleConnectionErrors(error) {
  return Promise.reject(error);
}

/**
 * Makes API call using fetch
 * @param {String} method - HTTP request method
 * @param {Object} reqOptions
 * @returns {Promise<Response>}
 */
function Api(method, reqOptions) {
  const url = getReqUrl(reqOptions);
  const options = getReqOptions(method, reqOptions);

  return fetch(url, options)
    .then((response) => parseResponse(response))
    .catch((error) => handleConnectionErrors(error));
}

export default {
  GET: (req) => Api('GET', req),
  POST: (req) => Api('POST', req),
  PUT: (req) => Api('PUT', req),
  DELETE: (req) => Api('DELETE', req),
};
