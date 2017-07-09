import React from 'react';
import { string } from 'prop-types';
import Tick from 'react-icons/lib/md/check';
import LeftArrow from 'react-icons/lib/md/keyboard-backspace';
import Plus from 'react-icons/lib/go/plus';

const iconNames = {
  tick: Tick,
  leftArrow: LeftArrow,
  plus: Plus,
};

const SvgIcon = (props) => {
  const { name, ...rest } = props;
  const Icon = iconNames[name];

  return <Icon {...rest} />;
};

SvgIcon.propTypes = {
  name: string,
};

export default SvgIcon;
