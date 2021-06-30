import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Card, RichCell } from '@vkontakte/vkui';
import CommentsCardClass from '../../utils/Gallery/Design/Comments/CommentsCard';

import styles from './style.module.scss';

const CommentsCard = ({ comment, onClick, scrollToComment }) => {

    const showComment = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const str = event.target.getAttribute('href').substring(1);
        scrollToComment(str)
    }


    return (
        // <Card
        //     mode='outline'
        //     onClick={onClick}
        // >
        <div
            id={`comment${comment.id}`}
            style={{ width: '100%' }}
            className='outlineCellButton'
            onClick={onClick}
        >
            <RichCell
                before={
                    <Avatar src={comment.user.photo_max} size={48} />
                }
                text={(
                    <>
                        {comment.replyTo &&
                            <>
                                <a 
                                    href={`#${comment.replyId}`}
                                    onClick={showComment}
                                    className={styles.reply}
                                >
                                    {comment.replyTo.first_name}
                                </a>
                                <span>, </span>
                            </>
                        }
                        {comment.text}
                    </>
                )}
                caption={comment.formatedDate}
                disabled
                multiline
            >
                {comment.userFullName}
            </RichCell>
        </div>

        // </Card>
    )
}

CommentsCard.propTypes = {
    comment: PropTypes.instanceOf(CommentsCardClass).isRequired
}

export default CommentsCard;