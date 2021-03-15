import { View } from '@vkontakte/vkui';
import React from 'react';
import { alertContext } from '../../App';
import Raiting from '../../panels/Raiting';
import Designer from '../../panels/Designer';
import PropTypes from 'prop-types';
import useRouter from '../../utils/useRouter';

const RaitingView = ({id}) => {

    const { poput } = alertContext();
    const router = useRouter();

    return (
        <View id={id} activePanel={router.bind.activePanel} popout={poput}>
            <Raiting id='raiting' />
            <Designer id='designer' />
        </View>
    )
}

RaitingView.propTypes = {
    id: PropTypes.string.isRequired
}

export default RaitingView;