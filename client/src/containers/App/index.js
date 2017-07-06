import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as bookActions from 'src/redux/book/actions';
import Button from 'src/components/Button';
import Input from 'src/components/Input';
import DataTable from 'src/components/DataTable';

const { func, object } = PropTypes;

@connect(
  (state) => ({ book: state.book }),
  {
    addBook: bookActions.addBook,
    fetchAllBooks: bookActions.fetchAllBooks,
  },
)
export default class App extends PureComponent {
  static propTypes = {
    addBook: func,
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

  onAddBtnClick = () => {
    this.props.addBook({
      title: 'Astonishing The Gods',
      author: 'Ben Okri',
      category: 'Fiction',
    });
  }

  render() {
    const cols = [
      { key: 'title', label: 'Title' },
      { key: 'author', label: 'Author' },
      { key: 'category', label: 'Category' },
    ];
    const data = Object.keys(this.props.book).reduce((acc, cur) => [...acc, this.props.book[cur]], []);

    return (
      <div>
        HOOO HOOOOOOOHOOO HOOOO
        <div>
          <Input placeholder="Book" />
        </div>
        <div>
          <Input placeholder="Author" />
        </div>
        <div>
          <Input placeholder="Category" />
        </div>
        <DataTable columns={cols} rows={data} />
        <Button onClick={this.onAddBtnClick}> Add Book </Button>
      </div>
    );
  }
}
