import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, RichCell } from '@vkontakte/vkui';
import CommentsCardClass from '../../utils/Gallery/Design/Comments/CommentsCard';

const CommentsCard = ({comment}) => {
    return (
        <RichCell
            before={
                <Avatar src={comment.user.photo_max} size={48} />
            }
            text={comment.text}
            caption={comment.formatedDate}
            disabled
        >
            {comment.userFullName}
        </RichCell>
    )
}

CommentsCard.propTypes = {
    comment: PropTypes.instanceOf(CommentsCardClass).isRequired
}

export default CommentsCard;