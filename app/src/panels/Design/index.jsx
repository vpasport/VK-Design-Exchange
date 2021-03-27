import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Group, Panel, PanelHeader, PanelHeaderBack, PanelSpinner, Title, Div, Button } from '@vkontakte/vkui';

import Info from './Info';

import styles from './style.module.scss';
import { alertContext } from '../../App';
import { getDesignInfoById } from '../../utils/helpers';
import { connect } from 'react-redux';
import { changeActiveDesign } from '../../store/Design/actions';
import { changeActiveDesignerId } from '../../store/Designer/actions';
import useRouter from '../../utils/useRouter';

const Design = ({ id, activeDesignId, activeDesign, changeActiveDesignerId, changeActiveDesign }) => {
    
    const { useAlert } = alertContext();
    const router = useRouter();

    const isFetchDesign = useMemo(() => Boolean(!activeDesign || activeDesign.getId() !== activeDesignId), [activeDesign]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const activeDesign = await getDesignInfoById(activeDesignId);
                changeActiveDesign(activeDesign);
            }
            catch (error) {
                useAlert.show('Ошибка', error.message, [{
                    title: 'Назад',
                    autoclose: true,
                    action: () => setActivePanel('gallery')
                }])
            }
        }

        if (isFetchDesign)
            fetchData();

    }, [])

    const changeAuthor = () => {
        changeActiveDesignerId(activeDesign.getDesignerId());
        router.setActiveStoryAndPanel('raiting', 'designer');
    }

    return (
        <Panel id={id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={() => router.back()} />}
            >
                Карточка сайта
            </PanelHeader>
            {!isFetchDesign ?
                <Group>
                    <Div className={styles.cardBlock}>
                        {/* <Info title='Проект заказчика:' text={activeDesign.getProjectDescription()} />
                        <Info title='Задача заказчика:' text={activeDesign.getTaskDescription()} />
                        <Info title='Что было сделано:' text={activeDesign.getCompletedWork()} /> */}

                        {activeDesign.getProjectDescription() && 
                            <div dangerouslySetInnerHTML={{__html: activeDesign.getProjectDescription()}} />
                        }
                        
                        <div className={styles.cardBlock__group_image}>
                            <Title level='1'>Дизайн</Title>
                            <img src={activeDesign.getWorkImage()} alt="test" />
                        </div>

                        {Boolean(activeDesign.getDesignerId() && router.getPrevRoute().panel !== 'portfolio') && 
                            <Button 
                                mode='outline' 
                                stretched 
                                size='l' 
                                className={styles.cardBlock__button}
                                onClick={changeAuthor}
                            >
                                В карточку автора
                            </Button>
                        }
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
        activeDesignId: state.design.activeDesignId,
        activeDesign: state.design.activeDesign
    }
}

const mapDispatchToProps = {
    changeActiveDesignerId,
    changeActiveDesign
}

export default connect(mapStateToProps, mapDispatchToProps)(Design);