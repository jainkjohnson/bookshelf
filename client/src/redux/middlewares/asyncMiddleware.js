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

  return promise(Api)
    .then((result) => next({ ...rest, result, type: asyncType }))
    .catch((error) => {
      throw new Error('ASYNC-MIDDLEWARE::', error);
    });
};
