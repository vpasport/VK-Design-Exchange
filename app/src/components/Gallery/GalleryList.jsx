import { CardGrid, ContentCard, Text, Title } from '@vkontakte/vkui';
import React from 'react';

import PropTypes from 'prop-types';
import DesignCard from '../../utils/Gallery/DesignCard';
import GalleryItem from './GalleryItem';

const GalleryList = ({ size = 'm', galleryList, onDesignChange, nullText = 'Работы отсутствуют' }) => {

    return (
        <>
            {galleryList.length ?
                <CardGrid size={size}>
                    {galleryList.map((el) => (
                        <GalleryItem
                            designCard={el}
                            key={el.getId()}
                            onChange={onDesignChange}
                        />
                    ))}
                </CardGrid>
            :
                <Title level='2' style={{textAlign: 'center', marginTop: 20}}>{nullText}</Title>
            }
        </>
    )
}

GalleryList.propTypes = {
    size: PropTypes.string,
    galleryList: PropTypes.arrayOf(PropTypes.instanceOf(DesignCard)).isRequired,
    onDesignChange: PropTypes.func.isRequired,
    nullText: PropTypes.string
}

export default GalleryList;