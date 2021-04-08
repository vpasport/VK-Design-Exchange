import { Button, FormItem, FormLayout, Group, Textarea } from '@vkontakte/vkui';
import React, { useEffect } from 'react';
import ModalPage from '../../components/ModalPage';
import useInput from '../../utils/useInput';
import { changeActiveOrderStatus } from '../../store/Order/actions';
import { alertContext, modalContext } from '../../App';
import { connect } from 'react-redux';

const CancelModal = ({activeOrder, changeActiveOrderStatus}) => {

    const cancelMessage = useInput('');
    const { useAlert, useSpinner } = alertContext();
    const { setActiveModal } = modalContext();

    const cancelOrder = async (event) => {
        event.preventDefault();
        
        try {
            useSpinner.showSpinner();
            await activeOrder.cancel(cancelMessage.value);
            changeActiveOrderStatus({statusId: 1, status: 'Отменен'})
            useAlert.show('Отмена заказа', 'Заказ успешно отменен');
            setActiveModal(null);
        }
        catch (error){
            useAlert.show('Ошибка', 'Ошибка при отмене заказа');
        }
        
    }

    return (
        <ModalPage id='cancel' headerName='Отмена заказа'>
            <Group>
                <FormLayout onSubmit={cancelOrder}>
                    <FormItem top='Опишите причину отмены'>
                        <Textarea {...cancelMessage} />
                    </FormItem>
                    <FormItem>
                        <Button stretched mode='destructive' size='l'>Отменить заказ</Button>
                    </FormItem>
                </FormLayout>
            </Group>
        </ModalPage>
    )
}

const mapStateToProps = (state) => ({
    activeOrder: state.order.activeOrder
})

const mapDispatchToProps = {
    changeActiveOrderStatus
}

export default connect(mapStateToProps, mapDispatchToProps)(CancelModal);