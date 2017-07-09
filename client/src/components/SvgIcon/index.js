import React from 'react';
import { string } from 'prop-types';

/* eslint-disable global-require */
const iconNames = {
  delete: require('react-icons/lib/ti/delete'),
  edit: require('react-icons/lib/md/edit'),
  emptyStar: require('react-icons/lib/fa/star-o'),
  fullStar: require('react-icons/lib/fa/star'),
  halfStar: require('react-icons/lib/fa/star-half-empty'),
  leftArrow: require('react-icons/lib/md/keyboard-backspace'),
  plus: require('react-icons/lib/go/plus'),
  tick: require('react-icons/lib/md/check'),
};
/* eslint-enable global-require */

const SvgIcon = (props) => {
  const { name, ...rest } = props;
  const Icon = iconNames[name];

  return <Icon {...rest} />;
};

SvgIcon.propTypes = {
  name: string,
};

export default SvgIcon;
