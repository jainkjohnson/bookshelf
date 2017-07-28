import React from 'react';
import { string } from 'prop-types';

/**
 * See more supported icons here:
 * {@link https://gorangajic.github.io/react-icons/index.html}
 */

/* eslint-disable global-require */
const iconNames = {
  delete: require('react-icons/lib/ti/delete'),
  edit: require('react-icons/lib/md/edit'),
  starEmpty: require('react-icons/lib/fa/star-o'),
  starHalf: require('react-icons/lib/fa/star-half-empty'),
  starFull: require('react-icons/lib/fa/star'),
  heartEmpty: require('react-icons/lib/ti/heart-outline'),
  heartHalf: require('react-icons/lib/ti/heart-half-outline'),
  heartFull: require('react-icons/lib/ti/heart-full-outline'),
  arrowLeft: require('react-icons/lib/md/keyboard-backspace'),
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
