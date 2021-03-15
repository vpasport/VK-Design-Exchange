import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Group, Panel, PanelHeader, PanelHeaderBack, PanelSpinner, Title, Div } from '@vkontakte/vkui';

import Info from './Info';

import styles from './style.module.scss';
import { alertContext } from '../../App';
import { getDesignInfoById } from '../../utils/helpers';
import { connect } from 'react-redux';
import { changeActiveDesignId } from '../../store/Design/actions';
import useRouter from '../../utils/useRouter';

const Design = ({ id, activeDesignId }) => {
    
    const { useAlert } = alertContext();
    const router = useRouter();

    const [designInfo, setDesignInfo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const designInfo = await getDesignInfoById(activeDesignId);
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
        if (activeDesignId)
            fetchData();

    }, [])

    return (
        <Panel id={id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={() => router.back()} />}
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
    activeDesignId: PropTypes.number.isRequired
}

const mapStateToProps = (state) => {
    return {
        activeDesignId: state.design.activeDesignId
    }
}

const mapDispatchToProps = {
    changeActiveDesignId
}

export default connect(mapStateToProps, mapDispatchToProps)(Design);