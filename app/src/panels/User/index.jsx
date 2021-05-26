import React from 'react';
import PropTypes from 'prop-types';
import { CellButton, Group, PanelHeader, Panel, Div, Title, Header } from '@vkontakte/vkui';
import { useDispatch } from 'react-redux';
import useRouter from '../../utils/useRouter';
import { changeStatus } from '../../store/OrdersList/actions';

const User = ({id}) => {

    const dispatch = useDispatch();
    const router = useRouter();

    const showOrders = (status) => {
        dispatch(changeStatus(status));
        router.setActivePanel('orders');
    }

    return (
        <Panel id={id}>
            <PanelHeader>Настройки</PanelHeader>
            <Group header={(
                <Header>Ваши заказы</Header>
            )}>
                <CellButton onClick={() => showOrders(null)}>Все заказы</CellButton>
                <CellButton onClick={() => showOrders(4)}>Готовые к проверке</CellButton>
                <CellButton onClick={() => showOrders(3)}>В работе</CellButton>
                <CellButton onClick={() => showOrders(2)}>На согласовании</CellButton>
                <CellButton onClick={() => showOrders(1)}>Отмененные</CellButton>
                <CellButton onClick={() => showOrders(5)}>Выполненые</CellButton>
            </Group>
        </Panel>
    )
}

export default User;