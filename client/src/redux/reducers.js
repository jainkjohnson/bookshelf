import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import bookReducer from 'src/redux/book/reducer';

export default combineReducers({
  routing: routerReducer,
  book: bookReducer,
});
