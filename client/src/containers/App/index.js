import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import appConfig from 'src/config/app';
import * as bookActions from 'src/redux/book/actions';
import Button from 'src/components/Button';
import Input from 'src/components/Input';
import DataTable from 'src/components/DataTable';
import styles from './styles.scss';

const { func, object } = PropTypes;

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
    reactIconBase: object,
  };

  static defaultProps = {
  };

  state = {
  };

  getChildContext() {
    return {
      reactIconBase: {
        size: appConfig.ICON_SIZE,
      },
    };
  }

  componentDidMount() {
    this.props.fetchAllBooks();
  }

  onAddBtnClick = () => {
    this.props.addBook({
      title: 'God Delusion',
      author: 'Richard Dawkins',
      category: 'Science',
    });
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
      <div className={styles.bookshelfApp}>
        <div>
          <Input placeholder="Book" />
        </div>
        <div>
          <Input placeholder="Author" />
        </div>
        <div>
          <Input placeholder="Category" />
        </div>
        <Button onClick={this.onAddBtnClick}> Add Book </Button>
        <DataTable
          columns={cols}
          rows={data}
          onRowEditClick={this.onEditClick}
          onRowDeleteClick={this.onDeleteClick}
        />
      </div>
    );
  }
}
