module.exports = {
  DB_URL: 'mongodb://localhost/bookshelf',
  API_PORT: 4001,
  HASH_SALT_ROUNDS: 10,
  USER_BOOK_SCHEMA_PROPS: [
    'toRead', 'haveRead', 'toBuy', 'nowReading', 'rating'
  ]
};
