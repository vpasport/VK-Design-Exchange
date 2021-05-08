import { CellButton, FormItem } from '@vkontakte/vkui';
import React, {useMemo} from 'react';
import { modalContext } from '../../../App';
import useSelectModal from '../../../utils/useSelectModal';

const ModalRadioSelect = ({ params, changeFilter, activeFilters }) => {

    const selectModal = useSelectModal();
    const { setActiveModal } = modalContext();
    const filterType = useMemo(() => params.type, []);

    const changeSelectValue = (value) => {
        if (!value) value = null;

        changeFilter(value, filterType);
    }

    return (
        <FormItem top={params.name}>
            <CellButton
                onClick={() => selectModal.show({
                    header: params.header,
                    onClose: () => setActiveModal('filters'),
                    selectList: params.filters.map(el => ({ label: el.status, value: el.type })),
                    onChange: (val) => changeSelectValue(val),
                    value: activeFilters[filterType]
                })}
            >
                {params.filters.find(el => el.type === activeFilters[filterType]).status}
            </CellButton>
        </FormItem>
    )
}

export default ModalRadioSelect;