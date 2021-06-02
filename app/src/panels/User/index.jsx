import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { CellButton, Group, PanelHeader, Panel, Div, Title, Header } from '@vkontakte/vkui';
import Button from './Button';
import { useDispatch } from 'react-redux';
import { useRouter } from '@unexp/router';
import { changeStatus } from '../../store/OrdersList/actions';

import styles from './style.module.scss';
import { getOrdersCountWithStatus, openVkLink } from '../../utils/helpers';
import { sessionContext } from '../../App';
import { Icon28BrushOutline, Icon28More, Icon28RecentOutline, Icon28DoneOutline, Icon28CancelOutline, Icon24FavoriteOutline, Icon28ChatsOutline, Icon24ViewOutline } from '@vkontakte/icons';

const User = ({ id }) => {

    const dispatch = useDispatch();
    const { push } = useRouter();
    const { fromMobile } = sessionContext();

    const [counts, setCounts] = useState();

    useEffect(() => {
        const fetchData = async () => {
            const counts = await getOrdersCountWithStatus();

            setCounts(counts)
        }

        fetchData();
    }, [])

    const showOrders = (status) => {
        dispatch(changeStatus(status));
        push({ panel: 'orders' });
    }

    const handleGroupOpen = () => {
        openVkLink('https://vk.com/im?media=&sel=-193986385', fromMobile)
    }

    const allCounts = useMemo(() => counts && counts.reduce((pas, par) => pas + par.count, 0))

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
                        after={allCounts !== 0 && allCounts}
                    >
                        Все заказы
                    </Button>
                    <Button
                        onClick={() => showOrders(4)}
                        before={<Icon28RecentOutline />}
                        after={counts && counts.find(el => el.status === 4)?.count}
                    >
                        Готовые к проверке
                    </Button>
                    <Button
                        onClick={() => showOrders(3)}
                        before={<Icon28BrushOutline />}
                        after={counts && counts.find(el => el.status === 3)?.count}
                    >
                        В работе
                    </Button>
                    <Button
                        before={<Icon28RecentOutline />}
                        onClick={() => showOrders(2)}
                        after={counts && counts.find(el => el.status === 2)?.count}
                    >
                        На согласовании
                    </Button>
                    <Button
                        onClick={() => showOrders(1)}
                        before={<Icon28CancelOutline />}
                        after={counts && counts.find(el => el.status === 1)?.count}
                    >
                        Отмененные
                    </Button>
                    <Button
                        onClick={() => showOrders(5)}
                        before={<Icon28DoneOutline />}
                        after={counts && counts.find(el => el.status === 5)?.count}
                    >
                        Выполненые
                    </Button>
                </Div>
            </Group>
            <Group>
                <Div className={styles.buttonsBlock}>
                    <Button
                        onClick={() => push({ panel: 'favorites' })}
                        before={<Icon24FavoriteOutline />}
                    >
                        Избранное
                    </Button>
                    <Button
                        onClick={() => push({ panel: 'viewed' })}
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