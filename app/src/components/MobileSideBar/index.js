import React from 'react';
import PropTypes from 'prop-types';

import { Tabbar, TabbarItem } from '@vkontakte/vkui';

const MobileSideBar = ({ params, activeStory, onStoryChange }) => {
    return (
        <Tabbar>
            {params.map((el, i) => (
                <TabbarItem
                    selected={el.story === activeStory}
                    data-story={el.story}
                    text={el.name}
                    onClick={(e) => onStoryChange(e.currentTarget.dataset.story, el.defaultPanel)}
                    key={i}
                >
                    {el.icon}
                </TabbarItem>
            ))}

        </Tabbar>
    )
}

MobileSideBar.propTypes = {
    params: PropTypes.arrayOf(PropTypes.object).isRequired,
    activeStory: PropTypes.string.isRequired,
    onStoryChange: PropTypes.func.isRequired
}

export default MobileSideBar;