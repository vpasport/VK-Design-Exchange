import { Card, Cell, Avatar } from '@vkontakte/vkui';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import StarRatings from 'react-star-ratings';

import DesignerCardClass from '../../utils/Raiting/DesignerCard';
import { useDispatch } from 'react-redux';
import { changeActiveDesignerId } from '../../store/Designer/actions';
import useRouter from '../../utils/useRouter';

const DesignerItem = ({ designerCard }) => {

    const dispatch = useDispatch();
    const router = useRouter();

    const handleDesignerChange = () => {
        
        dispatch(changeActiveDesignerId(designerCard.getId())); 
        router.setActivePanel('designer');
    }

    return (
        <Card onClick={handleDesignerChange}>
            <Cell
                description={
                    <div>
                        <StarRatings
                            rating={designerCard.getRaiting()}
                            starRatedColor='#FEDA5B'
                            numberOfStars={5}
                            starDimension='15px'
                            starSpacing='2px'
                        />
                        <span style={{marginLeft: 10}}>{designerCard.getRaiting() || 0}</span>
                    </div>
                }
                before={
                    <Avatar src={designerCard.getPhoto()} />
                }
            >
                {`${designerCard.getFirstName()} ${designerCard.getLastName()}`}
            </Cell>
        </Card>
    )
}

DesignerItem.propTypes = {
    designerCard: PropTypes.instanceOf(DesignerCardClass).isRequired,
}

export default DesignerItem;