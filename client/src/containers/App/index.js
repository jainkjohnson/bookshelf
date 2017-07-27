import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import appConfig from 'src/config/app';
import styles from './styles.scss';

const { object, any } = PropTypes;

@connect(
  () => ({}),
  {},
)
export default class App extends PureComponent {
  static propTypes = {
    children: any
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
        {this.props.children}
      </div>
    );
  }
}
