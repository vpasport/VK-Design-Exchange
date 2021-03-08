import { CardGrid, Div, PanelSpinner, SliderSwitch, Title } from '@vkontakte/vkui';
import React, { useMemo, useState } from 'react';

import PropTypes from 'prop-types';
import DesignCard from '../../utils/Gallery/DesignCard';
import GalleryItem from './GalleryItem';
import ListBlock from '../ListBlock';
import { useView } from '../../App';
import useList from '../../utils/useList';
import { Icon16GridOfFour } from '@vkontakte/icons';
import { Icon16ArticleOutline } from '@vkontakte/icons';

import GalleryClass from '../../utils/Gallery/Gallery';
import { getCardHeightBySize } from '../../utils/helpers';

const GalleryList = ({ size = 'm', onDesignChange, nullText = 'Работы отсутствуют', loadCount = 20, from = null, to = null }) => {

    const [ size_, setSize ] = useState(size);

    const galleryClass = useMemo(() => new GalleryClass(), []);

    const { useAlert } = useView();
    const listHook = useList(galleryClass.getGallery, from, to, loadCount, useAlert);

    const switchSlider = (e) => {
        setSize(e)
    }

    return (
        <>
            {listHook.bind.isLoad ?
                <>
                <Div>
                    <SliderSwitch options={[
                        {
                            name: <Icon16GridOfFour />,
                            value: 'm'
                        },
                        {
                            name: <Icon16ArticleOutline />,
                            value: 'l'
                        }
                    ]}
                    activeValue={size_}
                    onSwitch={switchSlider}
                    style={{width: 100}}/>
                </Div>
                <ListBlock
                    loadMore={listHook.loadList}
                    hasMore={listHook.bind.hasMore}
                >
                    {listHook.bind.list.length ?
                        <CardGrid size={size_}>
                            {listHook.bind.list.map((el, i) => (
                                <GalleryItem
                                    designCard={el}
                                    key={i}
                                    onChange={onDesignChange}
                                    height={getCardHeightBySize(size_)}
                                />
                            ))}
                        </CardGrid>
                        :
                        <Title level='2' style={{ textAlign: 'center', marginTop: 20 }}>{nullText}</Title>
                    }
                </ListBlock>
                </>
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