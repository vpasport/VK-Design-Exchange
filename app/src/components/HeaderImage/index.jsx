import React from 'react';
import PropTypes from 'prop-types';
import { Div, Title } from '@vkontakte/vkui';

import styles from './style.module.scss';

const HeaderImage = ({ image, left, right }) => {
    return (
        <div className={styles.headerImage}>
            <img src={image} alt={left} />
            <Div className={styles.headerImage__info}>
                <Title className={styles.headerImage__title} level='2'>{left}</Title>
                <Title className={styles.headerImage__price} level='1'>{right}</Title>
            </Div>
        </div>
    )
}

HeaderImage.propTypes = {
    image: PropTypes.string.isRequired,
    left: PropTypes.string,
    right: PropTypes.string
}

export default HeaderImage;