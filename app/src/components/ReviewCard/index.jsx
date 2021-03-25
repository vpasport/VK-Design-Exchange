import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Card, RichCell } from '@vkontakte/vkui';
import StarRatings from '../StarRatings';
import ReviewCardClass from '../../utils/Raiting/ReviewCard';

const ReviewCard = ({reviewCard}) => {
    
    return (
        <Card mode='shadow'>
            <RichCell
                before={<Avatar src={reviewCard.getAuthor().photo} />}
                text={reviewCard.getText()}
                caption={<StarRatings rating={reviewCard.getRating()} />}
            >
                {reviewCard.getAuthor().first_name} {reviewCard.getAuthor().last_name}
            </RichCell>
        </Card>
    )
}

ReviewCard.propTypes = {
    reviewCard: PropTypes.instanceOf(ReviewCardClass).isRequired
}

export default ReviewCard;