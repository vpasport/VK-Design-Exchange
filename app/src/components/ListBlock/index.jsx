import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Icon24ArrowUpOutline } from '@vkontakte/icons';

import { PullToRefresh, Div, CardGrid, PanelSpinner, Text, Button } from '@vkontakte/vkui';

import InfiniteScroll from 'react-infinite-scroller';
import { alertContext, sessionContext } from '../../App';
import useList from '../../utils/useList';
import FiltersList from '../../components/FiltersList';
import ScrollUpButton from "react-scroll-up-button";

import styles from './style.module.scss';

const ListBlock = ({ children, loadList, loadFilters, from = null, to = null,
    loadCount = null, actionType, isChangeSize = false, loadingCondition, nullText = 'Список пустой', pullToRefresh = true, showScrollTop = true }) => {

    const { useAlert } = alertContext();
    const { isDesktop } = sessionContext();

    const listHook = useList(loadList, loadFilters, from, to, loadCount, useAlert, actionType, loadingCondition);

    const content = (
        <>
            {showScrollTop &&
                <ScrollUpButton
                    ContainerClassName={styles.arrowTop}
                    TransitionClassName={styles.arrowTop__transition}
                >
                    <Button
                        before={<Icon24ArrowUpOutline />}
                        mode='secondary'
                        style={{ width: 50, height: 50, borderRadius: '100%' }}
                    />
                </ScrollUpButton>
            }
            <FiltersList
                filters={listHook.bind.filters}
                size={listHook.bind.listFormat}
                changeListFormat={listHook.changeListFormat}
                isChangeSize={isChangeSize}
                updateList={listHook.bind.updateList}
            />
            {listHook.bind.list.length ?
                <InfiniteScroll
                    loadMore={listHook.getList}
                    hasMore={listHook.bind.hasMore && listHook.bind.isLoad}
                    loader={<PanelSpinner size='large' key={0} />}
                    initialLoad={false}
                >
                    <CardGrid
                        size={listHook.bind.listFormat}
                        className={Boolean(isDesktop || !showScrollTop) || styles.block}
                    >
                        {listHook.bind.list.map((el) => (
                            children(el)
                        ))}
                    </CardGrid>
                </InfiniteScroll>
                :
                <Div>
                    <Text weight='semibold' style={{ textAlign: 'center' }}>{nullText}</Text>
                </Div>
            }
        </>
    )

    const PullToRefreshOrDiv = useCallback(() => {
        if (pullToRefresh && !isDesktop)
            return React.createElement(PullToRefresh, {
                onRefresh: listHook.updateList,
                isFetching: listHook.bind.isFetch
            }, content)

        return React.createElement('div', null, content);
    }, [listHook])

    return (
        <>
            {listHook.bind.isLoad ?
                PullToRefreshOrDiv()
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
    actionType: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['s', 'm', 'l']),
    isChangeSize: PropTypes.bool,
    loadingCondition: PropTypes.func,
    nullText: PropTypes.string
}

export default ListBlock;