import { CardGrid, PanelSpinner, Title } from '@vkontakte/vkui';
import React, { useMemo } from 'react';

import PropTypes from 'prop-types';
import DesignCard from '../../utils/Gallery/DesignCard';
import GalleryItem from './GalleryItem';
import ListBlock from '../ListBlock';
import { useView } from '../../App';
import useList from '../../utils/useList';

import GalleryClass from '../../utils/Gallery/Gallery';

const GalleryList = ({ size = 'm', onDesignChange, nullText = 'Работы отсутствуют', loadCount = 20, from = null, to = null }) => {

    const galleryClass = useMemo(() => new GalleryClass(), []);

    const { useAlert } = useView();
    const listHook = useList(galleryClass.getGallery, from, to, loadCount, useAlert)

    return (
        <>
            {listHook.bind.isLoad ?
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
                                />
                            ))}
                        </CardGrid>
                        :
                        <Title level='2' style={{ textAlign: 'center', marginTop: 20 }}>{nullText}</Title>
                    }
                </ListBlock>
            :
                <PanelSpinner size='large' />
            }
        </>
    )
}

GalleryList.propTypes = {
    size: PropTypes.string,
    galleryList: PropTypes.arrayOf(PropTypes.instanceOf(DesignCard)),
    onDesignChange: PropTypes.func.isRequired,
    nullText: PropTypes.string,
}

export default GalleryList;