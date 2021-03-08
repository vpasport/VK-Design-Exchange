import React, { useEffect, useState } from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';

import PropTypes from 'prop-types';
import { Group, PanelSpinner } from '@vkontakte/vkui';

import GalleryClass from '../../utils/Gallery/Gallery';
import GalleryList from '../../components/Gallery/GalleryList';
import { useView } from '../../App';

const Gallery = ({ id, onDesignChange }) => {

    return (
        <Panel id={id}>
            <PanelHeader>Маркетплейс #ТаняДизайн</PanelHeader>
            <Group>
                <GalleryList
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