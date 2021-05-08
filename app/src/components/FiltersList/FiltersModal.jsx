import React, { useEffect, useMemo } from 'react';
import { ModalPage, Group, ModalPageHeader, PanelHeaderClose, Header, CellButton, Select, FormItem, CustomSelectOption, CustomSelect, SelectMimicry, withModalRootContext } from '@vkontakte/vkui';
import { modalContext, sessionContext } from '../../App';
import { useDispatch, useSelector } from 'react-redux';
import { Icon20Check } from '@vkontakte/icons';
import { changeActiveFilters, updateList } from '../../store/ListBlock/actions';
import SelectModal from './SelectModal';
import useSelectModal from '../../utils/useSelectModal';
import * as ModalFormComponents from './ModalFormComponents';

const FiltersModal = ({ id, stateType, updateModalHeight }) => {

    const { setActiveModal } = modalContext();
    const { isDesktop } = sessionContext();
    const { filters, activeFilters } = useSelector(state => state[stateType]);
    const dispatch = useDispatch();

    const dispatchActionType = useMemo(() => stateType.toUpperCase(), []);

    const changeFilter = (newFilter, type) => {
        dispatch(changeActiveFilters(dispatchActionType)({ ...activeFilters, [type]: newFilter }));
        dispatch(updateList(dispatchActionType)());
    }

    useEffect(() => {
        updateModalHeight();
    }, [filters]);

    return (
        <>
            <ModalPage
                id={id}
                onClose={() => setActiveModal(null)}
                header={
                    <ModalPageHeader
                        left={!isDesktop && <PanelHeaderClose onClick={() => setActiveModal(null)} />}
                    >
                        Фильтры
                </ModalPageHeader>
                }
            >
                {filters.map((el, i) => (
                    React.createElement(ModalFormComponents[el.componentName], {
                        params: el,
                        changeFilter,
                        activeFilters,
                        key: i
                    })
                ))}
            </ModalPage>
        </>
    )
}

export default withModalRootContext(FiltersModal);
//export default FiltersModal;