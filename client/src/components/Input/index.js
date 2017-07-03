import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const { oneOfType, bool, string, number, func } = PropTypes;

export default class Input extends PureComponent {
  static propTypes = {
    value: oneOfType([string, number]),
    onChange: func,
    onFocus: func,
    onBlur: func,
    label: string,
    type: string,
    step: string,
    disabled: bool,
    id: string,
    className: string,
    placeholder: string,
    required: bool,
  };

  static defaultProps = {
    type: 'text',
    placeholder: '',
  };

  render() {
    return (
      <input {...this.props} />
    );
  }
}
