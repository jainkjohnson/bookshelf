// 3rd-party libraries
import React, { PureComponent } from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';
// redux actions
import * as authActions from 'src/redux/auth/actions';
// components
import BasicInputForm from 'src/components/Forms/BasicInputForm';
// utils
import { redirect } from 'src/utils/routing';

@connect(
  (state) => ({ book: state.book }),
  {
    registerUser: authActions.registerUser,
  },
)
export default class App extends PureComponent {
  static propTypes = {
    // redux actions
    registerUser: func,
  };

  onSubmitClick = (userData) => {
    this.props.registerUser(userData)
      .then(() => redirect('/home'));
  }

  render() {
    return (
      <div>
        <BasicInputForm
          onSubmit={this.onSubmitClick}
          fieldNames={['email', 'username', 'password']}
        />
      </div>
    );
  }
}
