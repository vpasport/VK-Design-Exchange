import React from 'react';
import { Button } from '@vkontakte/vkui';

import styles from './style.module.scss';

const ButtonC = ({children, ...params}) => {
    return (
        <Button 
            stretched
            mode='secondary'
            size='l'
            align='left'
            className={`${styles.button} ${params.className}`}
            {...params}
        >
            {children}
        </Button>
    )
}

export default ButtonC;