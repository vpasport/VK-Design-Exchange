import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { View } from '@vkontakte/vkui';

import Gallery from '../../panels/Gallery';
import Design from '../../panels/Design';
import { alertContext } from '../../App';
import useRouter from '../../utils/useRouter';

const GalleryView = ({ id }) => {

    const { poput } = alertContext();
    const router = useRouter();

    return (
        <View id={id} activePanel={router.bind.activePanel} popout={poput}>
            <Gallery id='gallery' />
            <Design id='design' />
        </View>
    )
}

GalleryView.propTypes = {
    poput: PropTypes.node
}

export default GalleryView;