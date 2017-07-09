import {
  initialState,
  ADD_BOOK,
  UPDATE_BOOK,
  REMOVE_BOOK,
  FETCH_ALL_BOOKS,
} from './constants';

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_BOOK:
      return {
        ...state,
        [action.result._id]: {
          ...action.book,
          _id: action.result._id,
        },
      };
    case UPDATE_BOOK:
      return {
        ...state,
        [action.book._id]: action.result.book,
      };
    case REMOVE_BOOK:
      const currentState = { ...state };

      delete currentState[action.id];

      return currentState;
    case FETCH_ALL_BOOKS:
      const allBooks = action.result || [];
      const newState = allBooks.reduce((acc, cur) => ({
        ...acc,
        [cur._id]: cur,
      }), {});

      return {
        ...state,
        ...newState,
      };
    default:
      return state;
  }
}
