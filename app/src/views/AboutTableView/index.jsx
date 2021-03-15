import React from 'react';
import { View } from '@vkontakte/vkui';
import AboutTable from '../../panels/AboutTable';

import PropTypes from 'prop-types';

import { alertContext } from '../../App';
import useRouter from '../../utils/useRouter';

const AboutTableView = ({id}) => {

    const { poput } = alertContext();
    const router = useRouter();

    return (
        <View id={id} popout={poput} activePanel={router.bind.activePanel}>
            <AboutTable id='table' />
        </View>
    )
}

AboutTableView.propTypes = {
    id: PropTypes.string.isRequired
}

export default AboutTableView;