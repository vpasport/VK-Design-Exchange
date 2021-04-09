import React from 'react';
import PropTypes from 'prop-types';

import { Cell } from '@vkontakte/vkui';
import { Icon24CheckBoxOn } from '@vkontakte/icons';

const DesctopSideBarCell = ({ el, activeStory, onStoryChange }) => {
    return (
        <Cell
            disabled={activeStory === el.story}
            style={activeStory === el.story ? {
                backgroundColor: "var(--button_secondary_background)",
                borderRadius: 8,
            } : {}}
            data-story={el.story}
            onClick={(e) => onStoryChange(e.currentTarget.dataset.story, el.defaultPanel)}
            before={el.icon}
        >
            {el.name}
        </Cell>
    )
}

DesctopSideBarCell.propTypes = {
    el: PropTypes.object.isRequired,
    activeStory: PropTypes.string.isRequired,
    onStoryChange: PropTypes.func.isRequired
}

export default DesctopSideBarCell;