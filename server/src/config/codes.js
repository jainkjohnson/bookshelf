module.exports = {
  COMMON: {
    // Errors
    E_UNKNOWN: 'unknown Error',
    E_REQ_BODY: 'invalid request body',
    E_DUP: 'already exists'
  },
  USER: {
    // Success
    S_REG: 'registered successfully',
    S_LOGIN: 'login Success',
    S_LOGOUT: 'logout Success',
    // Errors
    E_EMAIL: 'wrong email',
    E_PWD: 'wrong password',
    E_AUTH: 'authentication failure'
  },
  BOOK: {
    // Success
    S_DEL: 'book successfully deleted',
    S_ADD: 'book successfully added',
    S_UPD: 'book successfully update',
    // Errors
    E_NOT_FOUND: 'book not found'
  },
  BOOKSHELF: {
    // Errors
    E_BOOK_DUP: 'book already exists in bookshelf'
  }
};
