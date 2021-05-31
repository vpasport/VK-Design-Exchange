import React from 'react';
import PropTypes from 'prop-types';
import { View } from '@vkontakte/vkui';

import Gallery from '../../panels/Gallery';
import Design from '../../panels/Design';
import { alertContext } from '../../App';
import useRouter from '../../utils/useRouter';
import ModalRoot from '../../components/ModalRoot';
import FiltersModal from '../../components/FiltersList/FiltersModal';
import SelectModal from '../../components/FiltersList/SelectModal';

const GalleryView = ({ id, activePanel}) => {

    const { poput } = alertContext();

    const modal = (
        <ModalRoot>
            <FiltersModal 
                id='filters'
                stateType='galleryList'
            />
            <SelectModal id='selectModal'/>
        </ModalRoot>
    )

    return (
        <View id={id} activePanel={activePanel} popout={poput} modal={modal}>
            <Gallery id='gallery' />
            <Design id='design' />
        </View>
    )
}

GalleryView.propTypes = {
    poput: PropTypes.node
}

export default GalleryView;