import React, { useEffect, useState } from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';

import PropTypes from 'prop-types';
import { Group } from '@vkontakte/vkui';

import GalleryListContainer from '../../components/Gallery/GalleryListContainer';

const Gallery = ({ id, onDesignChange }) => {

    return (
        <Panel id={id}>
            <PanelHeader>Маркетплейс #ТаняДизайн</PanelHeader>
            <Group>
                <GalleryListContainer
                    onDesignChange={onDesignChange}
                />
            </Group>

        </Panel>
    )

}

Gallery.propTypes = {
    id: PropTypes.string.isRequired,
    onDesignChange: PropTypes.func.isRequired
}

export default Gallery;