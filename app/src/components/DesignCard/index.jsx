import React from 'react';
import PropTypes from 'prop-types';

import { Card, ContentCard } from '@vkontakte/vkui';
import { useDispatch, useSelector } from 'react-redux';
import { changeActiveDesignId } from '../../store/Design/actions';

import DesignCardClass from '../../utils/Gallery/Design/DesignCard';

import styles from './style.module.scss';
import { getCardHeightBySize } from '../../utils/helpers';
import useRouter from '../../utils/useRouter';


const GalleryItem = ({ designCard, listFormat }) => {

    const dispatch = useDispatch();
    const router = useRouter();

    const handleDesignChange = () => {
        
        dispatch(changeActiveDesignId(designCard.getId())); 
        router.setActiveStoryAndPanel('gallery', 'design');
    }

    return (
        <Card
            className={styles.card}
            onClick={handleDesignChange}
        >
            <div className={styles.imgBlock}>
                <img src={designCard.getPreview()} className={styles.imgBlock__img}/>
            </div>
            <h5>
                {designCard.getTitle()}
            </h5>
        </Card>
    )
}

GalleryItem.propTypes = {
    designCard: PropTypes.instanceOf(DesignCardClass),
}

export default GalleryItem;