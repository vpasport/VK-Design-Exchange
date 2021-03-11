import React from 'react';
import Design from './index';
import PropTypes from 'prop-types';
import DesignCard from '../../utils/Gallery/DesignCard';

import { changeActiveDesign } from '../../store/Design/actions';
import { connect } from 'react-redux';

const DesignContainer = ({id, activeDesign}) => {
    return (
        <Design
            id={id}
            activeDesign={activeDesign}
        />
    )
}

DesignContainer.propTypes = {
    id: PropTypes.string.isRequired,
    activeDesign: PropTypes.instanceOf(DesignCard).isRequired
}

const mapStateToProps = (state) => {
    return {
        activeDesign: state.design.activeDesign
    }
}

const mapDispatchToProps = {
    changeActiveDesign
}

export default connect(mapStateToProps, mapDispatchToProps)(DesignContainer);