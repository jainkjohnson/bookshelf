import {
  AUTH_USER,
  initialState
} from './constants';

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case AUTH_USER:
      return {
        ...state,
        email: action.message
      };
    default:
      return state;
  }
}
