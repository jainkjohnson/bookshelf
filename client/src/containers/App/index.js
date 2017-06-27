import React, { PureComponent } from 'react';
import Api from 'src/helpers/Api';
import bookApi from 'src/config/endpoints/book';

export default class App extends PureComponent {
  static propTypes = {
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
    Api.GET({ endpoint: bookApi.books })
      .then((books) => console.log('books: ', books));
  }

  componentWillReceiveProps() {
  }

  render() {
    return (
      <h1>
        HOOO HOOOOOOOHOOO HOOOO
      </h1>
    );
  }
}
