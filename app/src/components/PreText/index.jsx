import { Text } from '@vkontakte/vkui';
import React from 'react';

import PropTypes from 'prop-types';

import styles from './style.module.scss';

const PreText = ({children, weight, style, className}) => {
    return (
        <Text 
            weight={weight} 
            className={`${styles.text} ${className}`} 
            Component='pre'
            style={style}
        >
            {children}
        </Text>
    )
}

PreText.propTypes = {
    weight: PropTypes.oneOf('regular', 'medium', 'semibold'),
    style: PropTypes.object,
    className: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ])
}

export default PreText;