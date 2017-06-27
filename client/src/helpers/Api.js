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

export function getReqUrl({ params, endpoint, host }) {
  const base = host || apiRoot || '';
  const url = `${base}/${endpoint}`;

  return params ? getUrlWithQueryParams(url, params) : url;
}

export function getReqOptions(method, { headers, body }) {
  const requestOptions = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    },
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
