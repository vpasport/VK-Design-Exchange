import React from 'react';
import PropTypes from 'prop-types';
import { Icon24Like } from '@vkontakte/icons';
import { Icon24LikeOutline } from '@vkontakte/icons';

import styles from './style.module.scss';
import { Button } from '@vkontakte/vkui';

const LikeButton = ({ isChecked = false, count = 0, onClick = () => {} }) => {
    return (
        <Button
            className={`${styles.likeButtonBlock} ${isChecked && styles.likeButtonBlock_checked}`}
            mode='tertiary'
            before={isChecked ?
                <Icon24Like />
                :
                <Icon24LikeOutline />
            }
            onClick={onClick}
        >
            {count.toString()}
        </Button>
    )
}

LikeButton.propTypes = {
    isChecked: PropTypes.bool.isRequired,
    count: PropTypes.number.isRequired,
    onClick: PropTypes.func
}

export default LikeButton;