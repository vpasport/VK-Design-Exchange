import React from 'react';
import PropTypes from 'prop-types';
import { ContentCard } from '@vkontakte/vkui';
import StarRatings from '../StarRatings';
import ReviewCardClass from '../../utils/Raiting/ReviewCard';

const ReviewCard = ({reviewCard}) => {
    return (
        <ContentCard
            image={null}
            header={reviewCard.getText()}
            caption={<StarRatings rating={reviewCard.getRating()} />}
        />
    )
}

ReviewCard.propTypes = {
    reviewCard: PropTypes.instanceOf(ReviewCardClass).isRequired
}

export default ReviewCard;