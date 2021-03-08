import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Group, Panel, PanelHeader, PanelHeaderBack, PanelSpinner, Title, Div } from '@vkontakte/vkui';

import DesignCard from '../../utils/Gallery/DesignCard';
import { useView } from '../../App';
import Info from './Info';

import styles from './style.module.scss';

const Design = ({ id, activeDesign }) => {

    const { setActivePanel, useAlert } = useView();

    const [designInfo, setDesignInfo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const designInfo = await activeDesign.getDesignInfo();
                setDesignInfo(designInfo);
            }
            catch (error) {
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
                left={<PanelHeaderBack onClick={() => setActivePanel('gallery')} />}
            >
                Карточка сайта
            </PanelHeader>
            {designInfo ?
                <Group>
                    <Div className={styles.cardBlock}>
                        <Info title='Проект заказчика:' text={designInfo.getProjectDescription()} />
                        <Info title='Задача заказчика:' text={designInfo.getTaskDescription()} />
                        <Info title='Что было сделано:' text={designInfo.getCompletedWork()} />

                        <div className={styles.cardBlock__group_image}>
                            <Title level='1'>Дизайн</Title>
                            <img src={designInfo.getWorkImage()} alt="test" />
                        </div>

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