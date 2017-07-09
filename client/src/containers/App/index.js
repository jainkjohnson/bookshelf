import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import appConfig from 'src/config/app';
import Home from 'src/pages/Home';
import styles from './styles.scss';

const { object } = PropTypes;

@connect(
  () => ({}),
  {},
)
export default class App extends PureComponent {
  static propTypes = {
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

  render() {
    return (
      <div className={styles.bookshelfApp}>
        <Home />
      </div>
    );
  }
}
