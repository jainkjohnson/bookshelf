import bookApi from 'src/config/endpoints/book';
import {
  ADD_BOOK,
  REMOVE_BOOK,
  FETCH_ALL_BOOKS,
} from './constants';

export function fetchAllBooks() {
  return {
    asyncType: FETCH_ALL_BOOKS,
    promise: (Api) => Api.GET({ endpoint: bookApi.books }),
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
