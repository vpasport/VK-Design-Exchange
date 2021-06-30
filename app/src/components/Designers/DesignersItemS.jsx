import { Card, Subhead, Caption } from '@vkontakte/vkui';

import React from 'react';
import Avatar from '../Avatar';
import StarRatings from '../StarRatings';

import { Icon24CommentOutline } from '@vkontakte/icons';

import styles from './style.module.scss';

const DesignerItemS = ({designerCard, handleDesignerChange}) => {

    console.log(designerCard)

    return (
        <Card 
            className={styles.cardS}
            onClick={handleDesignerChange}
        >
            <Avatar src={designerCard.getPhoto()} size={80} online={designerCard.engaged} />
            <div>
                <Subhead 
                    weight='medium'
                    className={styles.cardS__name}
                >
                    {designerCard.getFirstName()}<br/>{designerCard.getLastName()}
                </Subhead>
                <div className={`${styles.description} ${styles.description_s}`}>
                    <StarRatings 
                        rating={designerCard.getRating()} 
                        numberClassName={styles.description__starsCount}
                        starDimension='12px'
                        numberOfStars={1}
                    />
                    <div className={styles.description__reviews}>
                        <Icon24CommentOutline width='16' height='16' />
                        <span className={styles.description__reviewsCount}>{designerCard.reviewsCount}</span>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default DesignerItemS;