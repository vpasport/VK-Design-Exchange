import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Group, Panel, PanelHeader, PanelHeaderBack, PanelSpinner, Title, Div, Text } from '@vkontakte/vkui';

import DesignCard from '../../utils/Gallery/DesignCard';
import { useView } from '../../App';

const Design = ({ id, activeDesign }) => {

    const { setActivePanel, useAlert } = useView();

    const [designInfo, setDesignInfo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const designInfo = await activeDesign.getDesignInfo();
                setDesignInfo(designInfo);
            }
            catch(error){
                useAlert.show('Ошибка', error.message, [{
                    title: 'Назад',
                    autoclose: true,
                    action: () => setActivePanel('gallery')
                }])
            }
        }

        setDesignInfo(null);
        if (activeDesign)
            fetchData();

    }, [activeDesign])

    return (
        <Panel id={id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={() => setActivePanel('gallery')}/>}
            >
                Карточка сайта
            </PanelHeader>
            {designInfo ?
                <Group>
                    <Div>
                        <Title level='1'>Проект заказчика:</Title>
                        <Text weight='medium' style={{marginTop: 12}}>{designInfo.getProjectDescription()}</Text>

                        <Title level='1' style={{marginTop: 20}}>Задача заказчика:</Title>
                        <Text weight='medium' style={{marginTop: 12}}>{designInfo.getTaskDescription()}</Text>

                        <Title level='1' style={{marginTop: 20}}>Что было сделано:</Title>
                        <Text weight='medium' style={{marginTop: 12}}>{designInfo.getCompletedWork()}</Text>

                        <Title level='1' style={{marginTop: 48}}>Дизайн</Title>
                        <img src={designInfo.getWorkImage()} style={{marginTop: 20, width: '100%'}} alt="test" />
                    </Div>
                </Group>
            :
                <PanelSpinner size='large' />
            }

        </Panel>
    )
}

Design.propTypes = {
    id: PropTypes.string.isRequired,
    activeDesign: PropTypes.instanceOf(DesignCard)
}

export default Design;