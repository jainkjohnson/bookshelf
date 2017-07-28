import {
  LOGIN_USER,
  REGISTER_USER,
  initialState
} from './constants';

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        email: action.email
      };
    case REGISTER_USER:
      return {
        ...state,
        email: action.email,
        username: action.username
      };
    default:
      return state;
  }
}
