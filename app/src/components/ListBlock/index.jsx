import React from 'react';
import PropTypes from 'prop-types';

import { PullToRefresh, Div, CardGrid, PanelSpinner, Text } from '@vkontakte/vkui';

import InfiniteScroll from 'react-infinite-scroller';
import { alertContext } from '../../App';
import useList from '../../utils/useList';
import FiltersList from '../../components/FiltersList';

const ListBlock = ({ children, loadList, loadFilters, from = null, to = null, loadCount = null, actionType, size, isChangeSize = false }) => {

    const { useAlert } = alertContext();

    const listHook = useList(loadList, loadFilters, from, to, loadCount, useAlert, actionType);

    return (
        <>
            {listHook.bind.isLoad ?
                <PullToRefresh
                    onRefresh={listHook.updateList}
                    isFetching={listHook.bind.isFetching}
                >
                    {loadFilters &&
                        <Div>
                            <FiltersList
                                filters={listHook.bind.filters}
                                size={listHook.bind.listFormat}
                                changeListFormat={listHook.changeListFormat}
                                activeFilters={listHook.bind.activeFilters}
                                changeActiveFilter={listHook.changeActiveFilter}
                                isChangeSize={isChangeSize}
                            />
                        </Div>
                    }
                    {listHook.bind.list.length ?
                        <InfiniteScroll
                            loadMore={listHook.getList}
                            hasMore={listHook.bind.hasMore && listHook.bind.isLoad}
                            loader={<PanelSpinner size='large' key={0} />}
                            initialLoad={false}
                        >
                            <CardGrid size={listHook.bind.listFormat}>
                                {listHook.bind.list.map((el) => (
                                    children(el)
                                ))}
                            </CardGrid>
                        </InfiniteScroll>
                        :
                        <Text weight='semibold'>Список пустой</Text>
                    }
                </PullToRefresh>
                :
                <PanelSpinner size='large' />
            }
        </>
    )
}

ListBlock.propTypes = {
    loadList: PropTypes.func.isRequired,
    loadFilters: PropTypes.func,
    from: PropTypes.number,
    to: PropTypes.number,
    loadCount: PropTypes.number,
    actionType: PropTypes.oneOf(['galleryList', 'designerList']).isRequired,
    size: PropTypes.oneOf(['s', 'm', 'l']),
    isChangeSize: PropTypes.bool
}

export default ListBlock;