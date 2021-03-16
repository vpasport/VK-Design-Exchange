import React from 'react';
import PropTypes from 'prop-types';

import { SplitCol, Group, Panel, PanelHeader } from '@vkontakte/vkui';

import DesctopSideBarCell from './DesctopSideBarCell';

const DesctopSideBar = ({ isDesktop, params, activeStory, onStoryChange }) => {
    return (
        <SplitCol fixed width="280px" maxWidth="280px">
            <Panel>
                {!isDesktop && <PanelHeader />}
                <Group style={{paddingTop: 20}}>
                    {params.map((el, i) => (
                        <DesctopSideBarCell 
                            el={el}
                            activeStory={activeStory}
                            onStoryChange={onStoryChange}
                            key={i}
                        />
                    ))}
                </Group>
            </Panel>
        </SplitCol>
    )
}

DesctopSideBar.propTypes = {
    isDesktop: PropTypes.bool.isRequired,
    params: PropTypes.arrayOf(PropTypes.object).isRequired,
    activeStory: PropTypes.string.isRequired,
    onStoryChange: PropTypes.func.isRequired
}

export default DesctopSideBar;