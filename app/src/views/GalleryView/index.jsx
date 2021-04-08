import React from 'react';
import PropTypes from 'prop-types';
import { View } from '@vkontakte/vkui';

import Gallery from '../../panels/Gallery';
import Design from '../../panels/Design';
import { alertContext } from '../../App';
import useRouter from '../../utils/useRouter';
import ModalRoot from '../../components/ModalRoot';
import FiltersModal from '../../components/FiltersList/FiltersModal';

const GalleryView = ({ id }) => {

    const { poput } = alertContext();
    const router = useRouter();

    const modal = (
        <ModalRoot>
            <FiltersModal 
                id='filters'
                stateType='galleryList'
            />
        </ModalRoot>
    )

    return (
        <View id={id} activePanel={router.bind.activePanel} popout={poput} modal={modal}>
            <Gallery id='gallery' />
            <Design id='design' />
        </View>
    )
}

GalleryView.propTypes = {
    poput: PropTypes.node
}

export default GalleryView;