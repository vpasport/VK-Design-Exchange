import React, { useMemo } from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';

import PropTypes from 'prop-types';
import { Group } from '@vkontakte/vkui';

import ListBlock from '../../components/ListBlock';
import GalleryClass from '../../utils/Gallery/Gallery';
import GalleryItem from '../../components/Gallery/GalleryItem';

const Gallery = ({ id }) => {

    const galleryList = useMemo(() => new GalleryClass(), []);

    return (
        <Panel id={id}>
            <PanelHeader>Маркетплейс #ТаняДизайн</PanelHeader>
            <Group>
                <ListBlock 
                    loadCount={10}
                    loadList={galleryList.getGallery}
                    loadFilters={galleryList.getFilters}
                    actionType='galleryList'
                    isChangeSize={true}
                >
                {(el) => (
                    <GalleryItem
                        designCard={el}
                        key={el.getId()}
                        //height={getCardHeightBySize(size)}
                    />
                )}
                </ListBlock>
            </Group>

        </Panel>
    )
}

Gallery.propTypes = {
    id: PropTypes.string.isRequired
}

export default Gallery;