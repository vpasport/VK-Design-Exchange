import React from 'react';
import PropTypes from 'prop-types';
import { ContentCard, Text } from '@vkontakte/vkui';

import styles from './style.module.scss';
import { useDispatch } from 'react-redux';
import useRouter from '../../utils/useRouter';
import { changeActiveOfferId } from '../../store/Designer/DesignerListBlock/Offers/Offer/actions';
import OfferCardClass from '../../utils/Raiting/Designer/Offer/OfferCard';
import { getCardHeightBySize } from '../../utils/helpers';

const OfferCard = ({offerCard, listFormat}) => {

    const dispatch = useDispatch();
    const router = useRouter();

    const handleOfferChange = () => {
        dispatch(changeActiveOfferId(offerCard.getId()));
        router.setActivePanel('offer');
    }

    return (
        <ContentCard
            image={offerCard.getPreview()}
            header={offerCard.getTitle()}
            text={
                <Text 
                    className={styles.card__price} 
                    weight='medium'
                >
                    {offerCard.getPrice()}₽
                </Text>
            }
            className={styles.card}
            onClick={handleOfferChange}
            height={getCardHeightBySize(listFormat)}
        />
    )
}

OfferCard.propTypes = {
    offerCard: PropTypes.instanceOf(OfferCardClass).isRequired,
    listFormat: PropTypes.string
}

export default OfferCard;