import React from 'react';
import PropTypes from 'prop-types';

import { ContentCard } from '@vkontakte/vkui';

import DesignCardClass from '../../utils/Gallery/DesignCard';

const { REACT_APP_API_URL } = process.env;

const GalleryItem = ({ designCard, onChange }) => {
    return (
        <ContentCard
            image={designCard.getPreview()}
            header={designCard.getTitle()}
            text={designCard.getDescription()}
            height={175}
            onClick={() => onChange(designCard)}
        />
    )
}

GalleryItem.propTypes = {
    designCard: PropTypes.instanceOf(DesignCardClass)
}

export default GalleryItem;