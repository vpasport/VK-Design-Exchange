import React from 'react';
import { Avatar as Avatar_ } from '@vkontakte/vkui';

const Avatar = ({ online, ...props }) => {


    const isBig = props.size > 60;
    const className = online && (isBig ? 'avatar__online avatar__online_big' : 'avatar__online');

    return (
        <Avatar_ {...props} className={className} />
    )
}

export default Avatar;