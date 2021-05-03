import React from 'react';
import PropTypes from 'prop-types';

import { Icon12View } from '@vkontakte/icons';

import styles from './style.module.scss';

const ViewsCounter = ({count = 0}) => {
    return (
        <div className={styles.counterBlock}>
            <Icon12View className={styles.counterBlock__icon}/>
            <span>{count}</span>
        </div>
    )
}

ViewsCounter.propTypes = {
    count: PropTypes.number.isRequired
}

export default ViewsCounter;