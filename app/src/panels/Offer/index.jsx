import { Div, Panel, PanelHeader, PanelHeaderBack, PanelSpinner, Text, Title, Group, Button } from '@vkontakte/vkui';
import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { alertContext, modalContext } from '../../App';
import useRouter from '../../utils/useRouter';

import { changeActiveOffer } from '../../store/Designer/DesignerListBlock/Offers/Offer/actions';
import { getOfferInfoById } from '../../utils/helpers';

import styles from './style.module.scss';
import HeaderImage from '../../components/HeaderImage';
import Price from '../../components/Price';

const Offer = ({ id, activeOffer, activeOfferId, changeActiveOffer }) => {

    const router = useRouter();
    const { useAlert } = alertContext();
    const { setActiveModal } = modalContext();

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
    }, []);

    return (
        <Panel id={id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={router.back} />}
            >
                Услуга
            </PanelHeader>
            {!isFetchOffer ?
                <>
                    <HeaderImage
                        image={activeOffer.getPreview()}
                        left={activeOffer.getTitle()}
                        right={<Price price={activeOffer.getPrice()} />}
                    />
                    <Group>
                        <Div>
                            <Title level='2'>Описание услуги</Title>
                            <div dangerouslySetInnerHTML={{ __html: activeOffer.getDescription() }} />
                            <Button
                                stretched
                                size='l'
                                onClick={() => setActiveModal('offer')}
                            >
                                Заказать услугу
                            </Button>
                        </Div>
                    </Group>
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