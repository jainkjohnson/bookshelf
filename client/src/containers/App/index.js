import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as bookActions from 'src/redux/book/actions';
import Button from 'src/components/Button';
import Input from 'src/components/Input';
// import DataTable from 'src/components/DataTable';

const { func } = PropTypes;

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
      title: 'Love in the Time of Cholera',
      author: 'Gabriel Garcia Marquez',
      category: 'Fiction',
    });
  }

  render() {
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
        <Button onClick={this.onAddBtnClick}> Add Book </Button>
      </div>
    );
  }
}
