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

const OffersView = ({id}) => {

    const router = useRouter();
    const { poput } = alertContext();

    const modal = (
        <ModalRoot>
            <CancelModal id='cancel'/>
        </ModalRoot>
    )

    return (
        <View id={id} activePanel={router.bind.activePanel} popout={poput} modal={modal}>
            <UserOrders id='orders' />
            <Order id='order' />
            <ReviewCreator id='review' />
        </View>
    )
}

OffersView.propTypes = {
    id: PropTypes.string.isRequired
}

export default OffersView;