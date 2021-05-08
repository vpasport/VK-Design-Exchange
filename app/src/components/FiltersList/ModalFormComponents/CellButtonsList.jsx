import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import { CellButton, FormItem, Group, Header } from '@vkontakte/vkui';
import { Icon20Check } from '@vkontakte/icons';

const CellButtonsList = ({ params, changeFilter, activeFilters }) => {

    const filterType = useMemo(() => params.type, []);

    const changeList = (id) => {
        const newFilter = [...(activeFilters[filterType] || [])];
        const findedActiveFilter = newFilter.indexOf(id);

        if (findedActiveFilter == -1) newFilter.push(id);
        else newFilter.splice(findedActiveFilter, 1);

        changeFilter(newFilter, filterType)
    }

    return (
        <FormItem top={params.name}>
            {params.filters.map(el => {
                const isActive = activeFilters[filterType] && activeFilters[filterType].some(activeEl => el.id === activeEl);

                return (
                    <CellButton
                        before={isActive && <Icon20Check />}
                        key={el.id}
                        onClick={() => changeList(el.id)}
                    >
                        {el.name}
                    </CellButton>
                )
            })}
        </FormItem>
    )
}

export default CellButtonsList;