import React from 'react';
import PropTypes from 'prop-types';
import { Div, getClassName, Group, Title, usePlatform } from '@vkontakte/vkui';

import styles from './style.module.scss';
import { sessionContext } from '../../App';

const HeaderImage = ({ image, left, right }) => {

    const platform = usePlatform();
    const { isDesktop } = sessionContext();

    return (
        <Group separator={isDesktop ? 'auto' : 'hide'}>
            <div className={`${styles.headerImage} ${styles[getClassName('headerImage', platform).split(' ')[1]]}`}>
                <img src={image} alt={left} />
                <Div className={styles.headerImage__info}>
                    <Title className={styles.headerImage__title} level='2'>{left}</Title>
                    <Title level='1'>{right}</Title>
                </Div>
            </div>
        </Group>
    )
}

HeaderImage.propTypes = {
    image: PropTypes.string.isRequired,
    left: PropTypes.string,
    right: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
}

export default HeaderImage;