import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Card, RichCell } from '@vkontakte/vkui';
import CommentsCardClass from '../../utils/Gallery/Design/Comments/CommentsCard';

import styles from './style.module.scss';

const CommentsCard = ({ comment }) => {
    return (
        <Card
            mode='outline'
        >
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
        </Card>
    )
}

CommentsCard.propTypes = {
    comment: PropTypes.instanceOf(CommentsCardClass).isRequired
}

export default CommentsCard;