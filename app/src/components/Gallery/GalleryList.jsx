import { CardGrid, Div, PanelSpinner, Title, PullToRefresh } from '@vkontakte/vkui';
import React, { useMemo, useState } from 'react';

import PropTypes from 'prop-types';
import GalleryItem from './GalleryItem';
import ListBlock from '../ListBlock';
import FiltersList from '../FiltersList';
import { useView } from '../../App';
import useList from '../../utils/useList';

import GalleryClass from '../../utils/Gallery/Gallery';
import { getCardHeightBySize } from '../../utils/helpers';

const GalleryList = ({ size, changeListFormat, onDesignChange, nullText, loadCount, from, to }) => {

    const galleryClass = useMemo(() => new GalleryClass(), []);


    const { useAlert } = useView();
    const listHook = useList(galleryClass.getGallery, galleryClass.getFilters, from, to, loadCount, useAlert, 'galleryList');

    return (
        <>
            {listHook.bind.list.length ?
                <PullToRefresh
                    onRefresh={listHook.updateList}
                    isFetching={listHook.bind.isFetching}
                >
                    <Div>
                        <FiltersList 
                            filters={listHook.bind.filters}
                            size={size}
                            changeListFormat={changeListFormat}
                            activeFilters={listHook.bind.activeFilters}
                            changeActiveFilter={listHook.changeActiveFilter}
                        />
                    </Div>
                    <ListBlock
                        loadMore={listHook.getList}
                        hasMore={listHook.bind.hasMore}
                    >
                        {listHook.bind.list.length ?
                            <CardGrid size={size}>
                                {listHook.bind.list.map((el, i) => (
                                    <GalleryItem
                                        designCard={el}
                                        key={i}
                                        onChange={onDesignChange}
                                        height={getCardHeightBySize(size)}
                                    />
                                ))}
                            </CardGrid>
                            :
                            <Title level='2' style={{ textAlign: 'center', marginTop: 20 }}>{nullText}</Title>
                        }
                    </ListBlock>
                </PullToRefresh>
                :
                <PanelSpinner size='large' />
            }
        </>
    )
}

GalleryList.propTypes = {
    size: PropTypes.string.isRequired,
    changeListFormat: PropTypes.func.isRequired,
    onDesignChange: PropTypes.func.isRequired,
    nullText: PropTypes.string,
    loadCount: PropTypes.number,
    from: PropTypes.number,
    to: PropTypes.number,
}

export default GalleryList;