import React, { useMemo } from 'react';

import { FormItem, Radio } from '@vkontakte/vkui';

const RadioList = ({ params, changeFilter, activeFilters }) => {

    const filterType = useMemo(() => params.type, []);

    const changeItem = (event) => {
        let value = event.target.value;

        if (!value) value = null;

        changeFilter(value, filterType);
    }

    return (
        <FormItem top={params.name}>
            {params.filters.map(el => {
                return (
                    <Radio
                        name={filterType}
                        value={el.type}
                        onChange={changeItem}
                        checked={activeFilters[filterType] == el.type}
                    >
                        {el.status}
                    </Radio>
                )
            })}
        </FormItem>
    )
}

export default RadioList;