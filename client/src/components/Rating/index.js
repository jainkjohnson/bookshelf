import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from 'src/components/SvgIcon';
import styles from './styles.scss';

const Rating = (props) => {
  const value = parseFloat(props.value);
  const maximum = ~~props.maximum;
  const fullStarsCount = Math.floor(value);
  const halfStar = !!(value - fullStarsCount);
  const stars = [];

  for (let index = 1; index <= maximum; index++) {
    if (index <= fullStarsCount) {
      stars.push(<SvgIcon name={`${props.type}Full`} key={index} />);
    } else if (halfStar && index === fullStarsCount + 1) {
      stars.push(<SvgIcon name={`${props.type}Half`} key={index} />);
    } else {
      stars.push(<SvgIcon name={`${props.type}Empty`} key={index} />);
    }
  }

  return (
    <div className={styles.rating}>
      {stars}
    </div>
  );
};

const { oneOfType, number, string, oneOf } = PropTypes;

Rating.propTypes = {
  value: oneOfType([number, string]),
  maximum: oneOfType([number, string]),
  type: oneOf(['heart', 'star'])
};

Rating.defaultProps = {
  type: 'star'
};

export default Rating;
