import React from 'react';
import PropTypes from 'prop-types';
import { Panel, PanelHeader, Group } from '@vkontakte/vkui';
import ListBlock from '../../components/ListBlock';
import OrderCard from '../../components/OrderCard';
import { connect } from 'react-redux';

const UserOffers = ({ id, userInfo }) => {

    return (
        <Panel id={id}>
            <PanelHeader>
                Заказы
            </PanelHeader>
            <Group>
                <ListBlock
                    actionType='ordersList'
                    loadList={userInfo.getOrders.bind(userInfo)}
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
    userInfo: state.user.activeUser
})

export default connect(mapStateToProps)(UserOffers);