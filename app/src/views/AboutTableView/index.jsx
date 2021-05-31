import React from 'react';
import { View } from '@vkontakte/vkui';
import AboutTable from '../../panels/AboutTable';

import PropTypes from 'prop-types';

import { alertContext } from '../../App';
import useRouter from '../../utils/useRouter';
import { useLocation } from '@unexp/router';

const AboutTableView = ({id, activePanel}) => {

    const { poput } = alertContext();
    
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