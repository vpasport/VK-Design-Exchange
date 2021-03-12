import React from 'react';
import PropTypes from 'prop-types';
import { Button, SliderSwitch } from '@vkontakte/vkui';
import { Icon16GridOfFour } from '@vkontakte/icons';
import { Icon16ArticleOutline } from '@vkontakte/icons';

import styles from './style.module.scss';

const FiltersList = ({ filters, size, changeListFormat, activeFilters, changeActiveFilter }) => {

    const sliderSwitchOptions =
        [{
            name: <Icon16GridOfFour />,
            value: 'm'
        },
        {
            name: <Icon16ArticleOutline />,
            value: 'l'
        }]

    const changeTag = (id) => {
        const newFilter = [...(activeFilters.tags || [])];
        const findedActiveFilter = newFilter.indexOf(id);

        if (findedActiveFilter == -1) newFilter.push(id);
        else newFilter.splice(findedActiveFilter, 1);

        changeActiveFilter({...activeFilters, tags: newFilter});
    }


    return (
        <>
            {filters && 
                <div className={styles.list}>
                    {'tags' in filters && filters.tags.map((el) => {
                            const isActive = activeFilters.tags.some(activeEl => el.id === activeEl);

                            return (
                                <Button
                                    mode={isActive ? 'primary' : 'secondary'}
                                    key={el.id}
                                    onClick={() => changeTag(el.id)}
                                >
                                    {el.name}
                                </Button>
                            )
                        })
                    }
                </div>
            }
            {size &&
                <div className={styles.bottom}>
                    <SliderSwitch options={sliderSwitchOptions}
                        activeValue={size}
                        onSwitch={(e) => changeListFormat(e)}
                        style={{ width: 100 }} />
                </div>
            }
        </>
    )
}

FiltersList.propTypes = {
    filters: PropTypes.array.isRequired,
    size: PropTypes.string,
    changeListFormat: PropTypes.func,
    activeFilters: PropTypes.array.isRequired,
    changeActiveFilter: PropTypes.func.isRequired
}

export default FiltersList;