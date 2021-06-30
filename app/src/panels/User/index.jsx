import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Group, PanelHeader, Panel, Div, Header, Text, Counter } from '@vkontakte/vkui';
import OutlineCellButtonBlock from '../../components/OutlineCellButtonBlock';
import OutlineCellButton from '../../components/OutlineCellButton';
import { useDispatch } from 'react-redux';
import { useRouter } from '@unexp/router';
import { changeStatus } from '../../store/OrdersList/actions';

import styles from './style.module.scss';
import { getOrdersCountWithStatus, openVkLink } from '../../utils/helpers';
import { sessionContext } from '../../App';
import { Icon28ListCircleFillGray } from '@vkontakte/icons';
import { Icon28ClockCircleFillGray } from '@vkontakte/icons';
import { Icon28EditCircleFillBlue } from '@vkontakte/icons';
import { Icon28CheckCircleFillYellow } from '@vkontakte/icons';
import { Icon28CancelCircleFillRed } from '@vkontakte/icons';
import { Icon28CheckCircleFill } from '@vkontakte/icons';
import { Icon28FavoriteCircleFillYellow } from '@vkontakte/icons';
import { Icon28DiscussionsCircleFill } from '@vkontakte/icons';
import { Icon20ViewCircleFillRed } from '@vkontakte/icons';
import After from './After';

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
            <Group 
                header={(
                    <Header>Ваши заказы</Header>
                )}
                separator='hide'
            >
                <OutlineCellButtonBlock>
                    <OutlineCellButton
                        onClick={() => showOrders(null)}
                        before={<Icon28ListCircleFillGray />}
                        indicator={allCounts !== 0 && <After params={allCounts} />}
                    >
                        Все заказы
                    </OutlineCellButton>
                    <OutlineCellButton
                        onClick={() => showOrders(4)}
                        before={<Icon28ClockCircleFillGray />}
                        indicator={counts && <After params={counts.find(el => el.status === 4)?.count} />}
                    >
                        Готовые к проверке
                    </OutlineCellButton>
                    <OutlineCellButton
                        onClick={() => showOrders(3)}
                        before={<Icon28EditCircleFillBlue />}
                        indicator={counts && <After params={counts.find(el => el.status === 3)?.count} />}
                    >
                        В работе
                    </OutlineCellButton>
                    <OutlineCellButton
                        before={<Icon28CheckCircleFillYellow />}
                        onClick={() => showOrders(2)}
                        indicator={counts && <After params={counts.find(el => el.status === 2)?.count} />}
                    >
                        На согласовании
                    </OutlineCellButton>
                    <OutlineCellButton
                        onClick={() => showOrders(1)}
                        before={<Icon28CancelCircleFillRed />}
                        indicator={counts && <After params={counts.find(el => el.status === 1)?.count} />}
                    >
                        Отмененные
                    </OutlineCellButton>
                    <OutlineCellButton
                        onClick={() => showOrders(5)}
                        before={<Icon28CheckCircleFill />}
                        indicator={counts && <After params={counts.find(el => el.status === 5)?.count} />}
                    >
                        Выполненые
                    </OutlineCellButton>
                </OutlineCellButtonBlock>
            </Group>
            <Group
                header={<Header>Общее</Header>}
                separator='hide'
            >
                <OutlineCellButtonBlock>
                    <OutlineCellButton
                        onClick={() => push({ panel: 'favorites' })}
                        before={<Icon28FavoriteCircleFillYellow />}
                    >
                        Избранное
                    </OutlineCellButton>
                    <OutlineCellButton
                        onClick={() => push({ panel: 'viewed' })}
                        before={<Icon20ViewCircleFillRed width={28} height={28}/>}
                    >
                        Просмотренные
                    </OutlineCellButton>
                    <OutlineCellButton
                        onClick={handleGroupOpen}
                        before={<Icon28DiscussionsCircleFill />}
                    >
                        Техподдержка
                    </OutlineCellButton>
                </OutlineCellButtonBlock>
            </Group>
        </Panel>
    )
}

export default User;