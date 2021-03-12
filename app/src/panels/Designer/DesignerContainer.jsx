import React from 'react';
import PropTypes from 'prop-types';
import Designer from '.';
import DesignerCard from '../../utils/Raiting/DesignerCard';
import { changeActiveDesigner } from '../../store/Designer/actions';
import { connect } from 'react-redux';

const DesignerContainer = ({id, activeDesigner}) => {
    return (
        <Designer
            id={id}
            activeDesigner={activeDesigner}
        />
    )
}

DesignerContainer.propTypes = {
    id: PropTypes.string.isRequired,
    activeDesigner: PropTypes.instanceOf(DesignerCard)
}

const mapStateToProps = (state) => {
    return {
        activeDesigner: state.designer.activeDesigner
    }
}

const mapDispatchToProps = {
    changeActiveDesigner
}

export default connect(mapStateToProps, mapDispatchToProps)(DesignerContainer);