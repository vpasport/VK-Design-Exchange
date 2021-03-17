import { View } from '@vkontakte/vkui';
import React from 'react';
import { alertContext } from '../../App';
import Raiting from '../../panels/Raiting';
import Designer from '../../panels/Designer';
import PropTypes from 'prop-types';
import useRouter from '../../utils/useRouter';
import Portfolio from '../../panels/Portfolio';
import Reviews from '../../panels/Reviews';

const RaitingView = ({id}) => {

    const { poput } = alertContext();
    const router = useRouter();

    return (
        <View id={id} activePanel={router.bind.activePanel} popout={poput}>
            <Raiting id='raiting' />
            <Designer id='designer' />
            <Portfolio id='portfolio' />
            <Reviews id='reviews' />
        </View>
    )
}

RaitingView.propTypes = {
    id: PropTypes.string.isRequired
}

export default RaitingView;