import { Card, Cell } from '@vkontakte/vkui';
import React from 'react';
import PropTypes from 'prop-types';
import StarRatings from '../StarRatings';

import DesignerCardClass from '../../utils/Raiting/Designer/DesignerCard';
import { useDispatch } from 'react-redux';
import { changeActiveDesignerId } from '../../store/Designer/actions';
import { useRouter } from '@unexp/router';

import styles from './style.module.scss';
import Avatar from '../Avatar';
import { Icon24CommentOutline } from '@vkontakte/icons';

const DesignerItem = ({ designerCard, handleDesignerChange }) => {

    return (
        <Cell
            description={
                <div className={styles.description}>
                    <StarRatings 
                        rating={designerCard.getRating()} 
                        numberClassName={styles.description__starsCount}
                        starDimension='12px'
                    />
                    <div className={styles.description__reviews}>
                        <Icon24CommentOutline width='16' height='16' />
                        <span className={styles.description__reviewsCount}>{designerCard.reviewsCount}</span>
                    </div>
                </div>
            }
            before={
                <Avatar src={designerCard.getPhoto()} online={designerCard.engaged}/>
            }
            className={`${styles.designerCard} designerCardLine`}
            expandable
            onClick={handleDesignerChange}
        >
            {`${designerCard.getFirstName()} ${designerCard.getLastName()}`}
        </Cell>
    )
}

DesignerItem.propTypes = {
    designerCard: PropTypes.instanceOf(DesignerCardClass).isRequired,
}

export default DesignerItem;