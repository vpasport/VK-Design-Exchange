import { Avatar, Div, Group, Panel, PanelHeader, PanelHeaderBack, PanelSpinner, SimpleCell, Text, Title } from '@vkontakte/vkui';
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { alertContext } from '../../App';
import { connect, useSelector } from 'react-redux';

import { changeActiveDesignerId, changeActiveDesigner } from '../../store/Designer/actions';
import { getDesignerInfoById } from '../../utils/helpers';
import useRouter from '../../utils/useRouter';

import styles from './style.module.scss';
import StarRatings from '../../components/StarRatings';

import { Icon24Work } from '@vkontakte/icons';
import { Icon24Advertising } from '@vkontakte/icons';

const Designer = ({ id, activeDesignerId, activeDesigner, changeActiveDesigner }) => {

    const { useAlert } = alertContext();
    const router = useRouter();

    const isFetchDesigner = useMemo(() => Boolean(!activeDesigner || activeDesigner.getId() !== activeDesignerId), [activeDesigner]);


    useEffect(() => {

        const fetchData = async () => {
            try {
                const activeDesigner = await getDesignerInfoById(activeDesignerId);
                //await activeDesigner.setPortfolio();
                changeActiveDesigner(activeDesigner)
            }
            catch (error) {
                useAlert.show('Ошибка', error.message, [{
                    title: 'Назад',
                    autoclose: true,
                    action: () => router.setActivePanel('raiting')
                }])
            }
        }

        if(isFetchDesigner)
            fetchData();

    }, [])

    return (
        <Panel id={id}>
            <PanelHeader left={
                <PanelHeaderBack onClick={() => router.back()} />}
            >
                Дизайнер
            </PanelHeader>
            {!isFetchDesigner ?
                <>
                    <Group>
                        <Div className={styles.userBlock}>
                            <Avatar src={activeDesigner.getPhoto()} className={styles.userBlock__photo} size={120} />
                            <div className={styles.userBlock__info}>
                                <Title weight='bold'>{`${activeDesigner.getFirstName()} ${activeDesigner.getLastName()}`}</Title>
                                <StarRatings rating={activeDesigner.getRating()} className={styles.userBlock__raiting} />
                                <Text className={styles.userBlock__status}>Занят до 21.12.2112</Text>
                            </div>
                        </Div>
                    </Group>
                    <Group>
                        <Div className={styles.specialisation}>
                            <Title level='3'>Биография</Title>
                            <Text className={styles.specialisation__text}>{activeDesigner.getSpecialisation() || 'Нет данных'}</Text>
                        </Div>
                    </Group>
                    <Group>
                        <SimpleCell 
                            before={<Icon24Work />} 
                            expandable
                            onClick={() => router.setActivePanel('portfolio')}
                        >
                            Посмотреть портфолио
                        </SimpleCell>
                        <SimpleCell 
                            before={<Icon24Advertising />} 
                            expandable
                            onClick={() => router.setActivePanel('reviews')}
                        >
                            Отзывы
                        </SimpleCell>
                    </Group>
                </>
            :
                <PanelSpinner size='large' />
            }

        </Panel>
    )
}

Designer.propTypes = {
    id: PropTypes.string.isRequired,
    activeDesignerId: PropTypes.number.isRequired
}

const mapStateToProps = (state) => {
    return {
        activeDesignerId: state.designer.activeDesignerId,
        activeDesigner: state.designer.activeDesigner
    }
}

const mapDispatchToProps = {
    changeActiveDesignerId,
    changeActiveDesigner
}

export default connect(mapStateToProps, mapDispatchToProps)(Designer);