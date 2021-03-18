import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { View, ModalRoot, ModalPage } from '@vkontakte/vkui';

import Gallery from '../../panels/Gallery';
import Design from '../../panels/Design';
import { alertContext, modalContext } from '../../App';
import useRouter from '../../utils/useRouter';
import Modal from './Modal';

const GalleryView = ({ id }) => {

    const { poput } = alertContext();
    const router = useRouter();

    return (
        <View id={id} activePanel={router.bind.activePanel} popout={poput} modal={<Modal />}>
            <Gallery id='gallery' />
            <Design id='design' />
        </View>
    )
}

GalleryView.propTypes = {
    poput: PropTypes.node
}

export default GalleryView;