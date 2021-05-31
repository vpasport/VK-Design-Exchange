import React from 'react';
import PropTypes from 'prop-types';
import { CellButton, Group, PanelHeader, Panel, Div, Title, Header} from '@vkontakte/vkui';
import Button from './Button';
import { useDispatch } from 'react-redux';
import {useRouter} from '@unexp/router';
import { changeStatus } from '../../store/OrdersList/actions';

import styles from './style.module.scss';
import { openVkLink } from '../../utils/helpers';
import { sessionContext } from '../../App';

const User = ({ id }) => {

    const dispatch = useDispatch();
    const {push} = useRouter();
    const {fromMobile} = sessionContext();

    const showOrders = (status) => {
        dispatch(changeStatus(status));
        push({panel: 'orders'});
    }

    const handleGroupOpen = () => {
        openVkLink('https://vk.com/im?media=&sel=-193986385', fromMobile)
    }

    return (
        <Panel id={id}>
            <PanelHeader>Настройки</PanelHeader>
            <Group header={(
                <Header>Ваши заказы</Header>
            )}>
                <Div className={styles.buttonsBlock}>
                    <Button onClick={() => showOrders(null)}>Все заказы</Button>
                    <Button onClick={() => showOrders(4)}>Готовые к проверке</Button>
                    <Button onClick={() => showOrders(3)}>В работе</Button>
                    <Button onClick={() => showOrders(2)}>На согласовании</Button>
                    <Button onClick={() => showOrders(1)}>Отмененные</Button>
                    <Button onClick={() => showOrders(5)}>Выполненые</Button>
                </Div>
            </Group>
            <Group>
                <Div className={styles.buttonsBlock}>
                    <Button onClick={() => push({panel: 'favorites'})}>Избранное</Button>
                    <Button onClick={handleGroupOpen}>Техподдержка</Button>
                </Div>
            </Group>
        </Panel>
    )
}

export default User;