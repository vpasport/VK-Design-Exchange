import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@vkontakte/vkui';
import { Icon24ShareOutline } from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge';

import styles from './style.module.scss';

const {REACT_APP_API_APP_ID} = process.env;

const ShareButton = ({hash, className, style}) => {

    const handleShare = () => {
        bridge.send("VKWebAppShare", {
            link: `https://m.vk.com/app${REACT_APP_API_APP_ID}${hash}`
        })
    }

    return (
        <Button 
            mode='tertiary'
            onClick={handleShare}
            className={`${styles.shareButtonBlock} ${className}`}
            style={style}
        >
            <Icon24ShareOutline />
        </Button>
    )
}

ShareButton.propTypes = {
    hash: PropTypes.string
}

export default ShareButton;