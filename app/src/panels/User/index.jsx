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
import { Icon28BrushOutline, Icon28More, Icon28RecentOutline, Icon28DoneOutline, Icon28CancelOutline, Icon24FavoriteOutline, Icon28ChatsOutline, Icon24ViewOutline } from '@vkontakte/icons';

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
                    <Button 
                        onClick={() => showOrders(null)}
                        before={<Icon28More />}
                    >
                        Все заказы
                    </Button>
                    <Button 
                        onClick={() => showOrders(4)}
                        before={<Icon28RecentOutline />}
                    >
                        Готовые к проверке
                    </Button>
                    <Button 
                        onClick={() => showOrders(3)}
                        before={<Icon28BrushOutline />}
                    >
                        В работе
                    </Button>
                    {/* <Button onClick={() => showOrders(2)}>На согласовании</Button> */}
                    <Button 
                        onClick={() => showOrders(1)}
                        before={<Icon28CancelOutline />}
                    >
                        Отмененные
                    </Button>
                    <Button 
                        onClick={() => showOrders(5)}
                        before={<Icon28DoneOutline />}
                    >
                        Выполненые
                    </Button>
                </Div>
            </Group>
            <Group>
                <Div className={styles.buttonsBlock}>
                    <Button 
                        onClick={() => push({panel: 'favorites'})}
                        before={<Icon24FavoriteOutline />}
                    >
                        Избранное
                    </Button>
                    <Button 
                        onClick={() => push({panel: 'viewed'})}
                        before={<Icon24ViewOutline />}
                    >
                        Просмотренные
                    </Button>
                    <Button 
                        onClick={handleGroupOpen}
                        before={<Icon28ChatsOutline />}
                    >
                        Техподдержка
                    </Button>
                </Div>
            </Group>
        </Panel>
    )
}

export default User;