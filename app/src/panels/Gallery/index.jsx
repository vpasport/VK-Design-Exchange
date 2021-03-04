import React, { useEffect, useState } from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';

import PropTypes from 'prop-types';
import { Group, PanelSpinner } from '@vkontakte/vkui';

import GalleryClass from '../../utils/Gallery/Gallery';
import GalleryList from '../../components/Gallery/GalleryList';
import { useView } from '../../App';
import PreCacheImg from 'react-precache-img';

const Gallery = ({ id, onDesignChange }) => {

    const galleryClass = new GalleryClass();

    const { useAlert } = useView();

    const [galleryList, setGalleryList] = useState([]);
    const [isLoad, setIsLoad] = useState(false);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const data = await galleryClass.getGallery();
                setGalleryList(data);
                setIsLoad(true);
            }
            catch (error) {
                useAlert.error('Ошбика', error.message);
            }
        }

        fetchData();
    }, [])

    return (
        <Panel id={id}>
            <PanelHeader>Design exchange</PanelHeader>
            <Group>
                {isLoad ?
                    <GalleryList
                        galleryList={galleryList}
                        onDesignChange={onDesignChange}
                    />
                    :
                    <PanelSpinner size='large' />
                }

            </Group>

        </Panel>
    )

}

Gallery.propTypes = {
    id: PropTypes.string.isRequired,
    onDesignChange: PropTypes.func.isRequired
}

export default Gallery;