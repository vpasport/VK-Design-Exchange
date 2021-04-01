import { Div, Panel, PanelHeader, PanelHeaderBack, PanelSpinner, Text, Title, Group, Button } from '@vkontakte/vkui';
import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { alertContext } from '../../App';
import useRouter from '../../utils/useRouter';

import { changeActiveOffer } from '../../store/Designer/DesignerListBlock/Offers/Offer/actions';
import { getOfferInfoById } from '../../utils/helpers';

import styles from './style.module.scss';

const Offer = ({ id, activeOffer, activeOfferId, changeActiveOffer }) => {

    const router = useRouter();
    const { useAlert } = alertContext();

    const isFetchOffer = useMemo(() => Boolean(!activeOffer || activeOffer.getId() !== activeOfferId), [activeOffer]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const offer = await getOfferInfoById(activeOfferId);
                changeActiveOffer(offer);
            }
            catch (error) {
                useAlert.show('Ошибка', error.message, [{
                    title: 'Назад',
                    autoclose: true,
                    action: () => router.back()
                }])
            }
        }

        if (isFetchOffer)
            fetchData();
    }, [])

    return (
        <Panel id={id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={router.back} />}
            >
                Услуга
            </PanelHeader>
            {!isFetchOffer ?
                <>
                    <div className={styles.gradientBlock}>
                        <img src={activeOffer.getPreview()} alt={activeOffer.getTitle()} />
                        <Div className={styles.gradientBlock__info}>
                            <Title className={styles.gradientBlock__title} level='2' >{activeOffer.getTitle()}</Title>
                            <Title className={styles.gradientBlock__price} level='1'>{activeOffer.getPrice()}₽</Title>
                        </Div>
                    </div>
                    <Div>
                        <Group>
                            <Title level='2'>Описание услуги</Title>
                            <div dangerouslySetInnerHTML={{__html: activeOffer.getDescription()}} />
                            <Button stretched size='l'>Заказать услугу</Button>
                        </Group>
                    </Div>
                </>
                :
                <PanelSpinner size='large' />
            }

        </Panel>
    )
}

const mapStateToProps = (state) => ({
    activeOffer: state.offer.activeOffer,
    activeOfferId: state.offer.activeOfferId
})

const mapDispatchToProps = {
    changeActiveOffer
}

export default connect(mapStateToProps, mapDispatchToProps)(Offer);