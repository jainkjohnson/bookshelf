import endpoints from 'src/config/endpoints';
import { getUrlWithQueryParams } from 'src/utils/routing';

const { apiRoot } = endpoints;

export function checkStatus(response) {
  if (response.ok) {
    return response;
  }

  const error = new Error(response.statusText);

  throw error;
}

/**
 * Generate credentials
 * @param {string} credentials
 * @returns {string}
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

export function getReqUrl({ params, endpoint, host }) {
  const base = host || apiRoot || '';
  const url = `${base}/${endpoint}`;

  return params ? getUrlWithQueryParams(url, params) : url;
}

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

function Api(method, reqOptions) {
  const url = getReqUrl(reqOptions);
  const options = getReqOptions(method, reqOptions);

  return fetch(url, options)
    .then(checkStatus)
    .then((response) => response.json());
}

export default {
  GET: (req) => Api('GET', req),
  POST: (req) => Api('POST', req),
  PUT: (req) => Api('PUT', req),
  DELETE: (req) => Api('DELETE', req),
};
