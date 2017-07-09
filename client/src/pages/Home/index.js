import React, { PureComponent } from 'react';
import { func, object } from 'prop-types';
import { connect } from 'react-redux';
import * as bookActions from 'src/redux/book/actions';
import DataTable from 'src/components/DataTable';
import styles from './styles.scss';

@connect(
  (state) => ({ book: state.book }),
  {
    addBook: bookActions.addBook,
    removeBook: bookActions.removeBook,
    fetchAllBooks: bookActions.fetchAllBooks,
  },
)
export default class App extends PureComponent {
  static propTypes = {
    addBook: func,
    removeBook: func,
    fetchAllBooks: func,
    book: object,
  };

  static contextTypes = {
  };

  static childContextTypes = {
  };

  static defaultProps = {
  };

  state = {
  };

  getChildContext() {
    return {
    };
  }

  componentDidMount() {
    this.props.fetchAllBooks();
  }

  componentWillReceiveProps() {
  }

  onEditClick = (item) => {
    console.log('onEditClick : ', item);
  }

  onDeleteClick = (item) => {
    this.props.removeBook(item._id);
    console.log('onDeleteClick : ', item);
  }

  render() {
    const cols = [
      { key: 'title', label: 'Title' },
      { key: 'author', label: 'Author' },
      { key: 'category', label: 'Category' },
    ];
    const data = Object.keys(this.props.book).reduce((acc, cur) => [...acc, this.props.book[cur]], []);

    return (
      <div className={styles.homeContainer}>
        <header>
          <h1>Bookshelf</h1>
        </header>

        <nav className={styles.nav}>
          <ul>
            <li><a>London</a></li>
            <li><a>Paris</a></li>
            <li><a>Tokyo</a></li>
          </ul>
        </nav>

        <article className={styles.article}>
          <DataTable
            columns={cols}
            rows={data}
            onRowEditClick={this.onEditClick}
            onRowDeleteClick={this.onDeleteClick}
          />
        </article>

        <footer>
          <p>Bookshelf <a target="_blank" href="https://github.com/free-soul/bookshelf">source code</a></p>
          Copyright &copy; Yadhu Kiran
        </footer>
      </div>
    );
  }
}
