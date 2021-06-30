import React from 'react';
import { CellButton, Text } from '@vkontakte/vkui';

const OutlineCellButton = ({children, ...params}) => {
    return (
        <CellButton
            className={`outlineCellButton ${params.className}`}
            expandable={true}
            {...params}
        >
            <Text weight='medium'>{children}</Text> 
        </CellButton>
    )
}

export default OutlineCellButton;