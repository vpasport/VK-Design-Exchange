import React from 'react';
import PropTypes from 'prop-types';

import DesignerCardClass from '../../utils/Raiting/Designer/DesignerCard';
import { connect, useDispatch } from 'react-redux';
import { changeActiveDesignerId } from '../../store/Designer/actions';
import {useRouter} from '@unexp/router';

import * as Card from '.';

const DesignerItem = ({ designerCard, size }) => {

    const dispatch = useDispatch();
    const {push} = useRouter();
    
    const handleDesignerChange = () => {
        dispatch(changeActiveDesignerId(designerCard.getId())); 
        push({panel: 'designer'});
    }

    return (
       <>
            {React.createElement(Card[`DesignerItem${size.toUpperCase()}`], {designerCard, handleDesignerChange})}
       </>
    )
}

DesignerItem.propTypes = {
    designerCard: PropTypes.instanceOf(DesignerCardClass).isRequired,
}

const mapStateToProps = state => ({
    size: state.designerList.listFormat
})

export default connect(mapStateToProps)(DesignerItem);