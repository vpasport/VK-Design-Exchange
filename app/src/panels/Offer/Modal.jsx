import { ModalPage, ModalPageHeader, PanelHeaderClose, Text, Title, Group, Div, Button } from '@vkontakte/vkui';
import React from 'react';
import { connect } from 'react-redux';
import { alertContext, modalContext, sessionContext } from '../../App';

import styles from './style.module.scss';

const Modal = ({ id, activeOffer, userInfo }) => {

    const { setActiveModal } = modalContext();
    const { isDesctop } = sessionContext();
    const { useAlert } = alertContext();

    const handleConfirmOffer = async () => {
        try{
            const createResult = await userInfo.createOrder(activeOffer.getId());
        }
        catch(error){
            useAlert.error('Ошибка', error.message);
        }
    }

    return (
        <ModalPage
            id={id}
            onClose={() => setActiveModal(null)}
            header={
                <ModalPageHeader
                    left={!isDesctop && <PanelHeaderClose onClick={() => setActiveModal(null)} />}
                >
                    Заказ услуги
                </ModalPageHeader>
            }
        >
            <Group>
                <Div className={styles.modal}>
                    <Title level='2'>Название услуги:</Title>
                    <Text>{activeOffer.getTitle()}</Text>
                    <Title level='2' className={styles.modal__priceText}>Цена:</Title>
                    <Text className={styles.modal__price} weight='medium'>{activeOffer.getPrice()}₽</Text>
                </Div>
            </Group>
            <Group>
                <Div className={styles.modal}>
                    <Title level='2'>Перейти в чат с дизайнером?</Title>
                    <Button 
                        stretched 
                        className={styles.modal__button}
                        size='l'
                        onClick={handleConfirmOffer}
                    >
                        В чат
                    </Button>
                    <Button 
                        stretched 
                        mode='secondary' 
                        className={styles.modal__button}
                        size='l'
                        onClick={() => setActiveModal(null)}
                    >
                        Отмена
                    </Button>
                </Div>
            </Group>
        </ModalPage>
    )
}

const mapStateToProps = state => ({
    activeOffer: state.offer.activeOffer,
    userInfo: state.user.activeUser
})

export default connect(mapStateToProps)(Modal);