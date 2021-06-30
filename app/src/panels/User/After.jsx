import React from 'react';

import { Text, Counter } from '@vkontakte/vkui';

import styles from './style.module.scss';

const After = ({ params }) => {
    return (
        <div className={styles.after}>
            <Text className={styles.after_text}>{params}</Text>
            {/* <Counter mode='prominent' size='s'>1</Counter> */}
        </div>
    )
}

export default After;