import userApi from 'src/config/endpoints/user';
import { AUTH_USER } from './constants';

export function authenticateUser(auth) {
  return {
    asyncType: AUTH_USER,
    promise: (Api) => Api.POST({
      endpoint: userApi.authenticateUser,
      body: auth
    }),
  };
}
