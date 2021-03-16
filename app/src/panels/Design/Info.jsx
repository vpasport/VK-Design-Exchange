import React from 'react';
import PropTypes from 'prop-types';

import { Title } from '@vkontakte/vkui';
import PreText from '../../components/PreText';

import styles from './style.module.scss';

const Info = ({ title, text }) => {

    return (
        <>
            {text &&
                <div className={styles.cardBlock__group}>
                    <Title level='1'>{title}</Title>
                    <PreText className={styles.cardBlock__text}>{text}</PreText>
                </div>
            }
        </>
    )
}

Info.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
}

export default Info;