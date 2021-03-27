import { Panel, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';
import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { alertContext } from '../../App';
import useRouter from '../../utils/useRouter';

import { changeActiveOffer } from '../../store/Designer/DesignerListBlock/Offers/Offer/actions';
import { getOfferInfoById } from '../../utils/helpers';

const Offer = ({id, activeOffer, activeOfferId, changeActiveOffer}) => {

    const router = useRouter();
    const { useAlert } = alertContext();

    const isFetchOffer = useMemo(() => Boolean(!activeOffer || activeOffer.getId() !== activeOfferId), [activeOffer]);


    useEffect(() => {
        const fetchData = async () => {
            try{
                const offer = await getOfferInfoById(activeOfferId);
                changeActiveOffer(offer);
            }
            catch(error){
                useAlert.show('Ошибка', error.message, [{
                    title: 'Назад',
                    autoclose: true,
                    action: () => router.back()
                }])
            }
        }

        if(isFetchOffer)
            fetchData();
    }, [])

    return (
        <Panel id={id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={router.back}/>}
            >
                Услуга
            </PanelHeader>
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