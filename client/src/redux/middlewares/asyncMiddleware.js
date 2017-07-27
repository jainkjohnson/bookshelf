import Api from 'src/helpers/Api';

export default (store) => (next) => (action) => {
  const { dispatch, getState } = store;

  if (typeof action === 'function') {
    return action(dispatch, getState);
  }

  const { promise, asyncType, ...rest } = action;

  if (!promise) {
    return next(action);
  }

  const promiseApi = promise(Api);

  promiseApi
    .then((res) => next({ ...rest, result: res.data, type: asyncType }))
    .catch((error) => next({ ...rest, error, type: asyncType }));

  return promiseApi;
};
