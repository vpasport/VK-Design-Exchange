import React, { useMemo } from 'react';

import PropTypes from 'prop-types';
import { Group, Panel, PanelHeader } from '@vkontakte/vkui';

import ListBlock from '../../components/ListBlock';
import GalleryClass from '../../utils/Gallery';
import GalleryItem from '../../components/DesignCard';
import { connect } from 'react-redux';

const Gallery = ({ id, listFormat }) => {

    const galleryList = useMemo(() => new GalleryClass(), []);

    return (
        <Panel id={id}>
            <PanelHeader>Маркетплейс #ТаняДизайн</PanelHeader>
            <Group>
                <ListBlock 
                    loadCount={10}
                    loadList={galleryList.getGallery}
                    loadFilters={galleryList.getFilters}
                    actionType='galleryList'
                    isChangeSize={true}
                >
                {(el) => (
                    <GalleryItem
                        designCard={el}
                        key={el.getId()}
                        listFormat={listFormat}
                    />
                )}
                </ListBlock>
            </Group>

        </Panel>
    )
}

Gallery.propTypes = {
    id: PropTypes.string.isRequired
}

const mapStateToProps = state => {
    return {
        listFormat: state.galleryList.listFormat
    }
}

export default connect(mapStateToProps)(Gallery);