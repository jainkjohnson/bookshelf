// 3rd-party libraries
import React, { PureComponent } from 'react';
import { func, object } from 'prop-types';
import { connect } from 'react-redux';
// config
import appConfig from 'src/config/app';
// redux actions
import * as bookActions from 'src/redux/book/actions';
// components
import DataTable from 'src/components/DataTable';
import Modal from 'src/components/Modal';
import SvgIcon from 'src/components/SvgIcon';
import BasicInputForm from 'src/components/Forms/BasicInputForm';
// scss styles
import styles from './styles.scss';

@connect(
  (state) => ({ book: state.book }),
  {
    addBook: bookActions.addBook,
    updateBook: bookActions.updateBook,
    removeBook: bookActions.removeBook,
    fetchAllBooks: bookActions.fetchAllBooks,
  },
)
export default class App extends PureComponent {
  static propTypes = {
    // redux actions
    addBook: func,
    updateBook: func,
    removeBook: func,
    fetchAllBooks: func,
    // from redux state
    book: object,
  };

  static contextTypes = {
  };

  static childContextTypes = {
  };

  static defaultProps = {
  };

  state = {
    editBookId: '',
    showBookFormModal: false,
  };

  componentDidMount() {
    this.props.fetchAllBooks();
  }

  componentWillReceiveProps() {
  }

  onSubmitClick = (book) => {
    if (this.state.editBookId) {
      this.props.updateBook({ ...book, _id: this.state.editBookId });
    } else {
      this.props.addBook(book);
    }
  }

  onEditClick = (item) => {
    this.setState({ editBookId: item._id });
    this.toggleBookFormModal();
  }

  onCancelEdit = () => {
    this.setState({ editBookId: '' });
    this.toggleBookFormModal();
  }

  onDeleteClick = (item) => {
    this.props.removeBook(item._id);
  }

  toggleBookFormModal = () => {
    this.setState({ showBookFormModal: !this.state.showBookFormModal });
  }

  render() {
    const cols = [
      { key: 'title', label: 'Title' },
      { key: 'author', label: 'Author' },
      { key: 'category', label: 'Category' },
      { key: 'rating', label: 'Rating' },
    ];
    const data = Object.keys(this.props.book).reduce((acc, cur) => [...acc, this.props.book[cur]], []);

    return (
      <div className={styles.homeContainer}>
        <header>
          <h1>Bookshelf</h1>
        </header>

        <nav className={styles.nav} />

        <article className={styles.article}>
          <DataTable
            columns={cols}
            rows={data}
            onRowEditClick={this.onEditClick}
            onRowDeleteClick={this.onDeleteClick}
          />
          <div className={styles.floatingAddButton} onClick={this.toggleBookFormModal}>
            <SvgIcon name="plus" className={styles.plusIcon} />
          </div>
          {
            this.state.showBookFormModal &&
            <Modal
              onClose={
                this.state.editBookId
                ? this.onCancelEdit
                : this.toggleBookFormModal
              }
              body={
                <BasicInputForm
                  onSubmit={this.onSubmitClick}
                  fieldNames={appConfig.BOOK_FIELDS}
                  fieldValues={this.props.book[this.state.editBookId]}
                />
              }
            />
          }
        </article>

        <footer>
          <p>
            Bookshelf&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/free-soul/bookshelf"
            >
              source code
            </a>
          </p>
          Copyright &copy; Yadhu Kiran
        </footer>
      </div>
    );
  }
}
