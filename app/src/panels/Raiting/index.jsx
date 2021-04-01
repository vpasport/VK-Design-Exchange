import { Panel, PanelHeader, Group } from '@vkontakte/vkui';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ListBlock from '../../components/ListBlock';
import DesignerItem from '../../components/Designers/DesignerItem';

import RaitingClass from '../../utils/Raiting';

const Raiting = ({id}) => {

    const raiting = useMemo(() => new RaitingClass());

    return (
        <Panel id={id}>
            <PanelHeader>Рейтинг</PanelHeader>
            <Group>
                <ListBlock
                    loadList={raiting.getRaiting}
                    actionType='designerList'
                    loadCount={10}
                >
                    {el => (
                        <DesignerItem
                            designerCard={el}
                            key={el.getId()}
                        />
                    )}
                </ListBlock>
            </Group>
        </Panel>
    )
}

Raiting.proppTypes = {
    id: PropTypes.string.isRequired
}

export default Raiting;