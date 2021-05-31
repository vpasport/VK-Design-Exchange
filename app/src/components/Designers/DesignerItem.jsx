import { Card, Cell, Avatar } from '@vkontakte/vkui';
import React from 'react';
import PropTypes from 'prop-types';
import StarRatings from '../StarRatings';

import DesignerCardClass from '../../utils/Raiting/Designer/DesignerCard';
import { useDispatch } from 'react-redux';
import { changeActiveDesignerId } from '../../store/Designer/actions';
import {useRouter} from '@unexp/router';

const DesignerItem = ({ designerCard }) => {

    const dispatch = useDispatch();
    const {push} = useRouter();

    const handleDesignerChange = () => {
        dispatch(changeActiveDesignerId(designerCard.getId())); 
        push({panel: 'designer'});
    }

    return (
        <Card onClick={handleDesignerChange}>
            <Cell
                description={
                    <StarRatings rating={designerCard.getRating()} />
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