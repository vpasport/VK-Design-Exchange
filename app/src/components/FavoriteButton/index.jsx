import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@vkontakte/vkui';
import { Icon24FavoriteOutline } from '@vkontakte/icons';
import { Icon24Favorite } from '@vkontakte/icons';

import styles from './style.module.scss';

const FavoriteButton = ({ isChecked, onClick, ...props }) => {
    return (
        <Button
            mode='tertiary'
            before={
                isChecked ?
                    <Icon24Favorite />
                    :
                    <Icon24FavoriteOutline />
            }
            className={`${styles.button} ${props.className}`}
            style={props.style}
            onClick={onClick}
        />
    )
}

FavoriteButton.propTypes = {
    isChecked: PropTypes.bool
}

export default FavoriteButton;