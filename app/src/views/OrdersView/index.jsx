import React from 'react';
import PropTypes from 'prop-types';
import { View } from '@vkontakte/vkui';
import useRouter from '../../utils/useRouter';
import { alertContext } from '../../App';
import UserOrders from '../../panels/UserOrders';
import Order from '../../panels/Order';
import ModalRoot from '../../components/ModalRoot';
import CancelModal from './CancelModal';
import ReviewCreator from '../../panels/ReviewCreator';
import User from '../../panels/User';
import Favorites from '../../panels/Favorites';
import Viewed from '../../panels/Viewed';

const OffersView = ({id, activePanel}) => {

    const { poput } = alertContext();

    const modal = (
        <ModalRoot>
            <CancelModal id='cancel'/>
        </ModalRoot>
    )

    return (
        <View id={id} activePanel={activePanel} popout={poput} modal={modal}>
            <User id='user' />
            <UserOrders id='orders' />
            <Order id='order' />
            <ReviewCreator id='review' />
            <Favorites id='favorites' />
            <Viewed id='viewed' />
        </View>
    )
}

OffersView.propTypes = {
    id: PropTypes.string.isRequired
}

export default OffersView;