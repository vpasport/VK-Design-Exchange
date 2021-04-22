import { ModalPage, ModalPageHeader, PanelHeaderClose, Text, Title, Group, Div, Button, VKCOM } from '@vkontakte/vkui';
import React from 'react';
import { connect } from 'react-redux';
import { alertContext, modalContext, sessionContext } from '../../App';

import styles from './style.module.scss';

const Modal = ({ id, activeOffer, userInfo }) => {

    const { setActiveModal } = modalContext();
    const { isDesctop, activePlatform } = sessionContext();
    const { useAlert } = alertContext();

    const handleConfirmOffer = async () => {
        useAlert.show('Переход в чат', 'При переходе на страницу дизайнера, у вас автоматически создастся новый заказ', [
            {
                title: 'Ок',
                action: async () => {
                    try {
                        const createResult = await userInfo.createOrder(activeOffer.getId());

                        if(activePlatform === 'vkcom' || activePlatform === 'mobile_web')
                            window.open(`https://vk.com/id${activeOffer.getAuthor().vk_id}`, '_blank')
                        else
                            window.location.href = `https://vk.com/id${activeOffer.getAuthor().vk_id}`;

                        useAlert.hide();
                        setActiveModal(null);
                    }
                    catch (error) {
                        useAlert.error('Ошибка', error.message);
                    }
                }
            },
            {
                title: 'Отмена',
                autoclose: true,
                mode: 'cancel'
            }
        ])

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
                    <Title level='2'>Перейти на страницу дизайнера?</Title>
                    <Button
                        stretched
                        className={styles.modal__button}
                        size='l'
                        onClick={handleConfirmOffer}
                    >
                        На страницу дизайнера
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