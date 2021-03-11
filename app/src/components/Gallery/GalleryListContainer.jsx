import React from 'react';
import GalleryList from './GalleryList';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { changeListFormat, changeList } from '../../store/GalleryList/actions';

const GalleryListContainer = ({size, changeListFormat, nullText = 'Работы отсутствуют', 
                                loadCount = 10, from = 0, to = null}) => {

    return (
        <GalleryList 
            size={size} 
            changeListFormat={changeListFormat}
            nullText={nullText}
            loadCount={loadCount}
            from={from}
            to={to}
        />
    )
}

GalleryListContainer.propTypes = {
    size: PropTypes.string.isRequired,
    changeListFormat: PropTypes.func.isRequired,
    nullText: PropTypes.string,
    loadCount: PropTypes.number,
    from: PropTypes.number,
    to: PropTypes.number,
}

const mapStateToProps = (state) => {
    return {
        size: state.galleryList.listFormat,
    }
}

const mapDispatchToProps = {
    changeListFormat,
    changeList
}

export default connect(mapStateToProps, mapDispatchToProps)(GalleryListContainer)