import React from 'react';
import StarRatingsC from 'react-star-ratings';
import PropTypes from 'prop-types';

import styles from './style.module.scss';

const StarRatings = ({rating, className, style}) => {

    return (
        <div className={`${styles.raitingBlock} ${className}`} style={style}>
            <StarRatingsC
                rating={rating}
                starRatedColor='#FEDA5B'
                numberOfStars={5}
                starDimension='15px'
                starSpacing='2px'
            />
            <span className={styles.raitingBlock__number}>{rating || 0}</span>
        </div>
    )
}

StarRatings.propTypes = {
    rating: PropTypes.number,
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    style: PropTypes.object
}

export default StarRatings;