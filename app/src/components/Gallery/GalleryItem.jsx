import React from 'react';
import PropTypes from 'prop-types';

import { ContentCard } from '@vkontakte/vkui';

import DesignCardClass from '../../utils/Gallery/DesignCard';

import styles from './style.module.scss';


const GalleryItem = ({ designCard, onChange, height }) => {
    return (
        <ContentCard
            image={designCard.getPreview()}
            className={styles.card}
            header={designCard.getTitle()}
            height={height}
            onClick={() => onChange(designCard)}
            
        />
    )
}

GalleryItem.propTypes = {
    designCard: PropTypes.instanceOf(DesignCardClass),
    height: PropTypes.number.isRequired
}

export default GalleryItem;