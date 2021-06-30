import React from 'react';
import StarRatingsC from 'react-star-ratings';
import PropTypes from 'prop-types';

import styles from './style.module.scss';

const StarRatings = ({rating, className, style, changeRating = () => {}, showRatingNumber = true, 
    starDimension = '15px', starSpacing='2px', numberOfStars = 5, numberClassName}) => {

    return (
        <div className={`${styles.raitingBlock} ${className}`} style={style}>
            <StarRatingsC
                rating={rating}
                starRatedColor='#FEDA5B'
                starHoverColor='#FEDA5B'
                numberOfStars={numberOfStars}
                starDimension={starDimension}
                starSpacing={starSpacing}
                changeRating={changeRating}
            />
            {showRatingNumber && 
                <span className={`${styles.raitingBlock__number} ${numberClassName}`}>{rating || 0}</span>
            }
        </div>
    )
}

StarRatings.propTypes = {
    rating: PropTypes.number,
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    style: PropTypes.object
}

export default StarRatings;