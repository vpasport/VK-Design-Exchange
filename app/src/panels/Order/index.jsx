import { Group, Panel, PanelHeader, PanelHeaderBack, PanelSpinner, Title, Div, Button } from '@vkontakte/vkui';
import React, { useEffect, useMemo } from 'react';
import useRouter from '../../utils/useRouter';
import { changeActiveOrder, changeActiveOrderStatus } from '../../store/Order/actions';
import { connect } from 'react-redux';
import { alertContext, modalContext } from '../../App';
import HeaderImage from '../../components/HeaderImage';

import styles from './style.module.scss';
import Price from '../../components/Price';

const Order = ({ id, activeOrder, activeOrderId, changeActiveOrder, userInfo, changeActiveOrderStatus }) => {

    const router = useRouter();
    const { useAlert, useSpinner } = alertContext();
    const { setActiveModal } = modalContext();

    const isFetchOrder = useMemo(() => Boolean(!activeOrder || activeOrder.getId() !== activeOrderId), [activeOrder]);

    useEffect(() => {
        isFetchOrder && void async function () {
            try {
                const activeOrder = await userInfo.getOrder(activeOrderId);
                changeActiveOrder(activeOrder);
            }
            catch (error) {
                useAlert.show('Ошибка', error.message, [{
                    title: 'Назад',
                    autoclose: true,
                    action: () => router.setActivePanel('orders')
                }])
            }
        }();
    }, []);

    const handleCancelOrder = () => {
        setActiveModal('cancel');
    }

    const showReviewAlert = () => {
        useAlert.show('Заказ выполнен', 'Хотите оставить отзыв?', [
            {
                title: 'Да',
                autoclose: true,
                action: () => {

                }
            },
            {
                title: 'Нет',
                autoclose: true,
                action: () => useAlert.hide()
            }
        ])
    }

    const handleCompleteOrder = () => {
        useAlert.show('Завершение заказа', 'Вы уверены, что хотите завершить заказ?', [
            {
                title: 'Да',
                action: async () => {
                    try {
                        useSpinner.showSpinner();
                        await activeOrder.complete();
                        changeActiveOrderStatus({statusId: 5, status: 'Выполнен'});
                        showReviewAlert()
                    } catch (error) {
                        useAlert.show('Ошибка', error.message)
                    }
                }
            },
            {
                title: 'Нет',
                autoclose: true,
                action: () => useAlert.hide()
            }
        ])
    }

    const handleReviewOrder = () => {
        router.setActivePanel('review')
    }

    return (
        <Panel id={id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={router.back} />}
            >
                Заказ
            </PanelHeader>
            {!isFetchOrder ?
                <>
                    <HeaderImage
                        image={activeOrder.getPreview()}
                        left={activeOrder.getTitle()}
                        right={<Price price={activeOrder.getPrice()} />}
                    />
                    <Group>
                        <Div>
                            <Title level='3'>Статус: <i>{activeOrder.getStatus().toLowerCase()}</i></Title>
                            {Boolean(activeOrder.getStatusId() !== 1 && !activeOrder.getReview()) &&
                                <div className={styles.buttons}>
                                    {activeOrder.getStatusId() !== 5 &&
                                        <Button
                                            stretched
                                            mode='destructive'
                                            onClick={handleCancelOrder}
                                        >
                                            Отменить
                                        </Button>
                                    }
                                    {activeOrder.getStatusId() === 4 &&
                                        <Button 
                                            stretched 
                                            mode='commerce'
                                            onClick={handleCompleteOrder}
                                        >
                                            Выполнено
                                        </Button>
                                    }
                                    {Boolean(activeOrder.getStatusId() === 5 && !activeOrder.getReview()) && 
                                        <Button
                                            stretched
                                            mode='commerce'
                                            size='l'
                                            onClick={handleReviewOrder}
                                        >
                                            Оставить отзыв
                                        </Button>
                                    }
                                </div>
                            }
                        </Div>
                    </Group>
                    <Group>
                        <Div>
                            <Title level='2'>О услуге</Title>
                            <div dangerouslySetInnerHTML={{ __html: activeOrder.getDescription() }} />
                        </Div>
                    </Group>
                </>
                :
                <PanelSpinner size='large' />
            }
        </Panel>
    )
}

const mapStateToProps = state => ({
    activeOrder: state.order.activeOrder,
    activeOrderId: state.order.activeOrderId,
    userInfo: state.user.activeUser
});

const mapDispatchToProps = {
    changeActiveOrder,
    changeActiveOrderStatus
}

export default connect(mapStateToProps, mapDispatchToProps)(Order)