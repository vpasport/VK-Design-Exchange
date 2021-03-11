import React from 'react';
import { View } from '@vkontakte/vkui';
import AboutTable from '../../panels/AboutTable';

import PropTypes from 'prop-types';

import { alertContext, viewContext } from '../../App';

const AboutTableView = ({id}) => {

    const { poput } = alertContext();
    const { activePanel } = viewContext();

    return (
        <View id={id} popout={poput} activePanel={activePanel}>
            <AboutTable id='table' />
        </View>
    )
}

AboutTableView.propTypes = {
    id: PropTypes.string.isRequired
}

export default AboutTableView;