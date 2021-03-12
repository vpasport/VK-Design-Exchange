import { Panel, PanelHeader } from '@vkontakte/vkui';
import React from 'react';
import PropTypes from 'prop-types';

const Raiting = ({id}) => {
    return (
        <Panel id={id}>
            <PanelHeader>Рейтинг</PanelHeader>
        </Panel>
    )
}

Raiting.proppTypes = {
    id: PropTypes.string.isRequired
}

export default Raiting;