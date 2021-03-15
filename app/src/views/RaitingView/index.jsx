import { View } from '@vkontakte/vkui';
import React from 'react';
import { alertContext, viewContext } from '../../App';
import Raiting from '../../panels/Raiting';
import Designer from '../../panels/Designer';
import PropTypes from 'prop-types';

const RaitingView = ({id}) => {

    const { activePanel } = viewContext();
    const { poput } = alertContext();

    return (
        <View id={id} activePanel={activePanel} popout={poput}>
            <Raiting id='raiting' />
            <Designer id='designer' />
        </View>
    )
}

RaitingView.propTypes = {
    id: PropTypes.string.isRequired
}

export default RaitingView;