import { redirect } from 'src/utils/routing';

export default (store) => (next) => (action) => {
  const { dispatch, getState } = store;

  if (typeof action === 'function') {
    return action(dispatch, getState);
  }

  const { error, ...rest } = action;

  if (!error) {
    return next(action);
  }

  if (error.statusCode === 401) {
    redirect('/login');
  }

  return next(rest);
};
