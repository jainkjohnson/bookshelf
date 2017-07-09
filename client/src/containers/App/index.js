import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import appConfig from 'src/config/app';
import * as bookActions from 'src/redux/book/actions';
import Button from 'src/components/Button';
import Input from 'src/components/Input';
import Home from 'src/pages/Home';
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
  }

  onAddBtnClick = () => {
    this.props.addBook({
      title: 'God Delusion',
      author: 'Richard Dawkins',
      category: 'Science',
    });
  }

  render() {
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
        <Home />
      </div>
    );
  }
}
