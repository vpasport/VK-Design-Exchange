import { CardGrid, Div, PanelSpinner, SliderSwitch, Title, PullToRefresh } from '@vkontakte/vkui';
import React, { useMemo, useState } from 'react';

import PropTypes from 'prop-types';
import GalleryItem from './GalleryItem';
import ListBlock from '../ListBlock';
import { useView } from '../../App';
import useList from '../../utils/useList';
import { Icon16GridOfFour } from '@vkontakte/icons';
import { Icon16ArticleOutline } from '@vkontakte/icons';

import GalleryClass from '../../utils/Gallery/Gallery';
import { getCardHeightBySize } from '../../utils/helpers';

const GalleryList = ({ size, changeListFormat, onDesignChange, nullText, loadCount, from, to }) => {

    const galleryClass = useMemo(() => new GalleryClass(), []);
    const sliderSwitchOptions = 
            [{
                name: <Icon16GridOfFour />,
                value: 'm'
            },
            {
                name: <Icon16ArticleOutline />,
                value: 'l'
            }]


    const { useAlert } = useView();
    const listHook = useList(galleryClass.getGallery, from, to, loadCount, useAlert, 'galleryList');

    return (
        <>
            {listHook.bind.list.length ?
                <PullToRefresh
                    onRefresh={listHook.updateList}
                    isFetching={listHook.bind.isFetching}
                >
                    <Div>
                        <SliderSwitch options={sliderSwitchOptions}
                            activeValue={size}
                            onSwitch={(e) => changeListFormat(e)}
                            style={{ width: 100 }} />
                    </Div>
                    <ListBlock
                        loadMore={listHook.loadList}
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