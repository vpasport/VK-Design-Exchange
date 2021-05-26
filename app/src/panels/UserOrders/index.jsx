import React from 'react';
import PropTypes from 'prop-types';
import { Panel, PanelHeader, Group, PanelHeaderBack } from '@vkontakte/vkui';
import ListBlock from '../../components/ListBlock';
import OrderCard from '../../components/OrderCard';
import { connect } from 'react-redux';
import useRouter from '../../utils/useRouter';

const UserOffers = ({ id, userInfo, status }) => {

    const router = useRouter();

    return (
        <Panel id={id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={() => router.back()} />}
            >
                Заказы
            </PanelHeader>
            <Group>
                <ListBlock
                    actionType='ordersList'
                    loadList={userInfo.getOrders.call(userInfo, {status_id: status})}
                    loadingCondition={() => true}
                >
                    {el => (
                        <OrderCard
                            order={el}
                            key={el.getId()}
                        />
                    )}
                </ListBlock>
            </Group>
        </Panel>
    )
}

UserOffers.propTypes = {
    id: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
    userInfo: state.user.activeUser,
    status: state.ordersList.status
})

export default connect(mapStateToProps)(UserOffers);