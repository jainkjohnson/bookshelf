import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'src/utils/misc';
import { BUTTON_DISABLE_DURATION } from 'src/config/app';

const { string, func, node, bool } = PropTypes;

export default class Button extends PureComponent {
  static propTypes = {
    children: node,
    className: string,
    id: string,
    onMouseEnter: func,
    onMouseLeave: func,
    onClick: func,
    disabled: bool,
    preventMultipleClicks: bool,
  };

  static defaultProps = {
    disabled: false,
    preventMultipleClicks: false,
    onMouseEnter: noop,
    onMouseLeave: noop,
    onTouchTap: noop,
  };

  state = {
    clicked: false,
  };

  componentWillUnmount() {
    if (this.props.preventMultipleClicks) {
      clearTimeout(this.resetClick);
    }
  }

  handleMouseEnter = (event) => {
    this.setState({ hovered: true });
    this.props.onMouseEnter(event);
  };

  handleMouseLeave = (event) => {
    this.setState({ hovered: false });
    this.props.onMouseLeave(event);
  };

  handleTouchTap = (event) => {
    const { preventMultipleClicks } = this.props;

    if (preventMultipleClicks) {
      this.setState({ clicked: true });
      this.resetClick = setTimeout(() => this.setState({ clicked: false }), BUTTON_DISABLE_DURATION);
    }

    this.props.onClick(event);
  };

  render() {
    const {
      className,
      id,
      disabled,
      children: phrasingChild,
    } = this.props;

    const buttonProps = {
      className,
      id,
      disabled: disabled || this.state.clicked,
      onClick: this.handleTouchTap,
      onMouseEnter: this.handleMouseEnter,
      onMouseLeave: this.handleMouseLeave,
    };

    return (
      <button className={className} {...buttonProps} >
        {phrasingChild}
      </button>
    );
  }
}
