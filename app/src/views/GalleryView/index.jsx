import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { View } from '@vkontakte/vkui';

import Gallery from '../../panels/Gallery';
import Design from '../../panels/Design/DesignContainer';
import { alertContext, viewContext } from '../../App';

const GalleryView = ({ id }) => {

    const { poput } = alertContext();
    const { activePanel } = viewContext();


    return (
        <View id={id} activePanel={activePanel} popout={poput}>
            <Gallery id='gallery' />
            <Design id='design' />
        </View>
    )
}

GalleryView.propTypes = {
    poput: PropTypes.node
}

export default GalleryView;