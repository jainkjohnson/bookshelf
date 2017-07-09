import React from 'react';
import { number } from 'prop-types';
import SvgIcon from 'src/components/SvgIcon';
import styles from './styles.scss';

const Rating = (props) => {
  const fullStarsCount = Math.floor(props.value);
  const halfStar = !!(props.value - fullStarsCount);
  const stars = [];

  for (let index = 1; index <= props.maximum; index++) {
    if (index <= fullStarsCount) {
      stars.push(<SvgIcon name="fullStar" key={index} />);
    } else if (halfStar && index === fullStarsCount + 1) {
      stars.push(<SvgIcon name="halfStar" key={index} />);
    } else {
      stars.push(<SvgIcon name="emptyStar" key={index} />);
    }
  }

  return (
    <div className={styles.rating}>
      {stars}
    </div>
  );
};

Rating.propTypes = {
  value: number,
  maximum: number,
};

export default Rating;
