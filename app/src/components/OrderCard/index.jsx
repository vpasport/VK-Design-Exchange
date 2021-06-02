import React from 'react';
import PropTypes from 'prop-types';
import { Card, Div, Title, Text, ContentCard, Caption } from '@vkontakte/vkui';
import OrderCardClass from '../../utils/Orders/OrderCard';
import styles from './style.module.scss';
import { useDispatch } from 'react-redux';
import { changeActiveOrderId } from '../../store/Order/actions';
import {useRouter} from '@unexp/router';
import Price from '../Price';

const OrderCard = ({ order }) => {

    const dispatch = useDispatch()
    const {push} = useRouter();

    const handleOfferChange = () => {
        dispatch(changeActiveOrderId(order.getId()));
        push({panel: 'order'})
    }

    return (
        <ContentCard
            image={order.getPreview()}
            header={order.getTitle()}
            text={
                <>
                    <Title level='3' className={styles.card__price}><Price price={order.getPrice()} /></Title>
                    <Text className={styles.card__status}>
                        Статус: {order.getStatus().toLowerCase()}
                    </Text>
                    <Caption level='1' weight='regular' className={styles.card__date}>{order.updateDate}</Caption>
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