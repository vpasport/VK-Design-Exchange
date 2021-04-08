import { View } from '@vkontakte/vkui';
import React, { useState } from 'react';
import { alertContext } from '../../App';
import Raiting from '../../panels/Raiting';
import Designer from '../../panels/Designer';
import PropTypes from 'prop-types';
import useRouter from '../../utils/useRouter';
import Portfolio from '../../panels/Portfolio';
import Reviews from '../../panels/Reviews';
import Offers from '../../panels/Offers';
import Offer from '../../panels/Offer';
import ModalRoot from '../../components/ModalRoot';
import Modal from '../../panels/Offer/Modal';
import FiltersModal from '../../components/FiltersList/FiltersModal';
import SelectModal from '../../components/FiltersList/SelectModal';

const RaitingView = ({id}) => {

    const { poput } = alertContext();
    const router = useRouter();

    const modal = (
        <ModalRoot>
            <Modal id='offer' />
            <FiltersModal id='filters' stateType='designerList' />
            <SelectModal id='selectModal' />
        </ModalRoot>
    )

    return (
        <View id={id} activePanel={router.bind.activePanel} popout={poput} modal={modal}>
            <Raiting id='raiting' />
            <Designer id='designer' />
            <Portfolio id='portfolio' />
            <Reviews id='reviews' />
            <Offers id='offers' />
            <Offer id='offer' />
        </View>
    )
}

RaitingView.propTypes = {
    id: PropTypes.string.isRequired
}

export default RaitingView;