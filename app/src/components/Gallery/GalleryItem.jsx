import React from 'react';
import PropTypes from 'prop-types';

import { ContentCard } from '@vkontakte/vkui';
import { useDispatch, useSelector } from 'react-redux';
import { viewContext } from '../../App';
import { changeActiveDesignId } from '../../store/Design/actions';

import DesignCardClass from '../../utils/Gallery/DesignCard';

import styles from './style.module.scss';
import { getCardHeightBySize } from '../../utils/helpers';


const GalleryItem = ({ designCard }) => {

    const dispatch = useDispatch();
    const { setActivePanel } = viewContext();

    const { listFormat } = useSelector((state) => state.galleryList);

    const handleDesignChange = () => {
        
        dispatch(changeActiveDesignId(designCard.getId())); 
        setActivePanel('design');
    }

    return (
        <ContentCard
            image={designCard.getPreview()}
            className={styles.card}
            header={designCard.getTitle()}
            height={getCardHeightBySize(listFormat)}
            onClick={() => handleDesignChange()}
        />
    )
}

GalleryItem.propTypes = {
    designCard: PropTypes.instanceOf(DesignCardClass),
}

export default GalleryItem;