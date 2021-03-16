import React from 'react';
import StarRatingsC from 'react-star-ratings';
import PropTypes from 'prop-types';

import styles from './style.module.scss';

const StarRatings = ({raiting, className, style}) => {
    return (
        <div className={`${styles.raitingBlock} ${className}`} style={style}>
            <StarRatingsC
                rating={raiting}
                starRatedColor='#FEDA5B'
                numberOfStars={5}
                starDimension='15px'
                starSpacing='2px'
            />
            <span className={styles.raitingBlock__number}>{raiting || 0}</span>
        </div>
    )
}

StarRatings.propTypes = {
    raiting: PropTypes.number,
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    style: PropTypes.object
}

export default StarRatings;