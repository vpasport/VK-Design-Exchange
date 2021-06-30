import { Panel, PanelHeader, Group } from '@vkontakte/vkui';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ListBlock from '../../components/ListBlock';
import DesignerItem from '../../components/Designers/DesignerItem';

import RaitingClass from '../../utils/Raiting';

const Raiting = ({ id }) => {

    const raiting = useMemo(() => new RaitingClass());

    return (
        <Panel id={id}>
            <PanelHeader>Рейтинг</PanelHeader>
            <Group>
                <div className="designersList">
                    <ListBlock
                        loadList={raiting.getRaiting}
                        actionType='designerList'
                        loadCount={15}
                        loadFilters={raiting.getFilters}
                        isChangeSize={true}
                    >
                        {el => (
                            <DesignerItem
                                designerCard={el}
                                key={el.getId()}
                            />
                        )}
                    </ListBlock>
                </div>
            </Group>
        </Panel>
    )
}

Raiting.proppTypes = {
    id: PropTypes.string.isRequired
}

export default Raiting;