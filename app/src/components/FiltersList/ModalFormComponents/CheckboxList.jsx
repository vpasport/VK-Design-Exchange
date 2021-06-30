import { FormItem, Checkbox } from '@vkontakte/vkui';
import React, {useMemo} from 'react';

const CheckboxList = ({ params, changeFilter, activeFilters }) => {

    const filterType = useMemo(() => params.type, []);

    const handleChange = (id) => {
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
                    <Checkbox
                        name='checkboxSelect'
                        value={el.id}
                        onChange={() => handleChange(el.id)}
                        className='checkbox'
                        checked={isActive}
                    >
                        {el.name}
                    </Checkbox>
                )
            })}
        </FormItem>
    )
}

export default CheckboxList;