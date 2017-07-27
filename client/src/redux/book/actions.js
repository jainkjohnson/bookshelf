import bookApi from 'src/config/endpoints/book';
import {
  ADD_BOOK,
  UPDATE_BOOK,
  REMOVE_BOOK,
  FETCH_MY_BOOKS,
} from './constants';

export function fetchMyBooks() {
  return {
    asyncType: FETCH_MY_BOOKS,
    promise: (Api) => Api.GET({ endpoint: bookApi.myBooks }),
  };
}

export function removeBook(id) {
  return {
    id,
    asyncType: REMOVE_BOOK,
    promise: (Api) => Api.DELETE({
      endpoint: `${bookApi.deleteBook}/${id}`,
    }),
  };
}

export function addBook(book) {
  return {
    asyncType: ADD_BOOK,
    promise: (Api) => Api.POST({
      endpoint: bookApi.addBook,
      body: book,
    }),
    book,
  };
}

export function updateBook(book) {
  return {
    asyncType: UPDATE_BOOK,
    promise: (Api) => Api.PUT({
      endpoint: `${bookApi.updateBook}/${book._id}`,
      body: book,
    }),
    book,
  };
}
