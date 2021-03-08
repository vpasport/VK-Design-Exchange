import React from 'react';
import GalleryList from './GalleryList';
import PropTypes from 'prop-types';
import GalleryClass from '../../utils/Gallery/Gallery';

import { connect } from 'react-redux';

import { changeListFormat, changeGallery } from '../../store/GalleryList/actions';

const GalleryListContainer = ({size, changeListFormat, onDesignChange, nullText = 'Работы отсутствуют', 
                                loadCount = 10, from = null, to = null, gallery, changeGallery, dispatch}) => {

    console.log(dispatch)
    return (
        <GalleryList 
            size={size} 
            changeListFormat={changeListFormat}
            onDesignChange={onDesignChange}
            nullText={nullText}
            loadCount={loadCount}
            from={from}
            to={to}
            gallery={gallery}
            changeGallery={changeGallery}
        />
    )
}

GalleryListContainer.propTypes = {
    size: PropTypes.string.isRequired,
    changeListFormat: PropTypes.func.isRequired,
    onDesignChange: PropTypes.func.isRequired,
    nullText: PropTypes.string,
    loadCount: PropTypes.number,
    from: PropTypes.number,
    to: PropTypes.number,
    gallery: PropTypes.arrayOf(PropTypes.instanceOf(GalleryClass)).isRequired,
    changeGallery: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
    return {
        size: state.galleryList.listFormat,
        gallery: state.galleryList.gallery
    }
}

const mapDispatchToProps = {
    changeListFormat,
    changeGallery
}

export default connect(mapStateToProps, mapDispatchToProps)(GalleryListContainer)