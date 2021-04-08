import React from 'react';
import PropTypes from 'prop-types';
import { Card, Div, Title, Text, ContentCard } from '@vkontakte/vkui';
import OrderCardClass from '../../utils/Orders/OrderCard';
import styles from './style.module.scss';
import { useDispatch } from 'react-redux';
import useRouter from '../../utils/useRouter';
import { changeActiveOrderId } from '../../store/Order/actions';

const OrderCard = ({ order }) => {

    const dispatch = useDispatch()
    const router = useRouter();

    const handleOfferChange = () => {
        dispatch(changeActiveOrderId(order.getId()));
        router.setActivePanel('order')
    }

    return (
        <ContentCard
            image={order.getPreview()}
            header={order.getTitle()}
            text={
                <>
                    <Title level='3' className={styles.card__price}>{order.getPrice()}₽</Title>
                    <Text className={styles.card__status}>Статус: {order.getStatus().toLowerCase()}</Text>
                </>
            }
            onClick={handleOfferChange}
        />
    )
}

OrderCard.propTypes = {
    order: PropTypes.instanceOf(OrderCardClass).isRequired
}

export default OrderCard;