import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import bookReducer from 'src/redux/book/reducer';
import authReducer from 'src/redux/auth/reducer';

export default combineReducers({
  routing: routerReducer,
  book: bookReducer,
  auth: authReducer
});
