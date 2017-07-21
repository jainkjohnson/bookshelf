import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import appConfig from 'src/config/app';
import Button from 'src/components/Button';
import * as authActions from 'src/redux/auth/actions';
import styles from './styles.scss';

const { object, func } = PropTypes;

@connect(
  () => ({}),
  {
    authenticateUser: authActions.authenticateUser
  },
)
export default class Login extends PureComponent {
  static propTypes = {
    children: object,
    authenticateUser: func
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

  onLoginClick = () => {
    this.props.authenticateUser({
      email: this.state.email,
      password: this.state.password
    });
  }

  trackChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  }

  render() {
    return (
      <div className={styles.rootContainer}>
        <div className={styles.subContainer}>
          <div className={styles.headingContainer}>
            <label>LOGIN</label>
          </div>
          <div className={styles.formContainer}>
            <div className={styles.fields}>
              <label className={styles.loginLabel}>Email</label>
              <input
                type="email"
                name="password"
                id="password"
                className={styles.formControl}
                onChange={this.trackChange('email')}
              />
            </div>
            <div className={styles.fields}>
              <label className={styles.loginLabel}>Password</label>
              <input
                type="password"
                name="password"
                id="password"
                className={styles.formControl}
                onChange={this.trackChange('password')}
              />
            </div>
            <div className={styles.buttonContainer}>
              <Button className={styles.button} onClick={this.onLoginClick}>
                LOGIN
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
