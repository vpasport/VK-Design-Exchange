import React from 'react';
import PropTypes from 'prop-types';

import InfiniteScroll from 'react-infinite-scroller';
import { PanelSpinner } from '@vkontakte/vkui';

const ListBlock = ({children, loadMore, hasMore}) => {

    return (
        <InfiniteScroll
            loadMore={loadMore}
            hasMore={hasMore}
            loader={<PanelSpinner size='large' key={0}/>}
        >
            {children}
        </InfiniteScroll>
    )
}

ListBlock.propTypes = {
    loadMore: PropTypes.func,
    hasMore: PropTypes.bool.isRequired
}

export default ListBlock;