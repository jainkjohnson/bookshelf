import userApi from 'src/config/endpoints/user';
import { LOGIN_USER, REGISTER_USER } from './constants';

export function authenticateUser(credentials) {
  return {
    asyncType: LOGIN_USER,
    promise: (Api) => Api.POST({
      endpoint: userApi.authenticateUser,
      body: credentials
    }),
    email: credentials.email
  };
}

export function registerUser(userData) {
  return {
    asyncType: REGISTER_USER,
    promise: (Api) => Api.POST({
      endpoint: userApi.registerUser,
      body: userData
    }),
    email: userData.email,
    username: userData.username
  };
}
