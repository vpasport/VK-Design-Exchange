import React, { useEffect, useMemo } from 'react';
import { ModalPage, Group, ModalPageHeader, PanelHeaderClose, Header, CellButton, Select, FormItem, CustomSelectOption, CustomSelect, SelectMimicry } from '@vkontakte/vkui';
import { modalContext, sessionContext } from '../../App';
import { useDispatch, useSelector } from 'react-redux';
import { Icon20Check } from '@vkontakte/icons';
import { changeActiveFilters, updateList } from '../../store/ListBlock/actions';
import SelectModal from './SelectModal';
import useSelectModal from '../../utils/useSelectModal';

const FiltersModal = ({ id, stateType }) => {

    const { setActiveModal } = modalContext();
    const { isDesktop } = sessionContext();
    const { filters, activeFilters } = useSelector(state => state[stateType]);
    const dispatch = useDispatch();
    const selectModal = useSelectModal();

    const dispatchActionType = useMemo(() => stateType.toUpperCase(), []);

    const changeTag = (id) => {
        const newFilter = [...(activeFilters.tags || [])];
        const findedActiveFilter = newFilter.indexOf(id);

        if (findedActiveFilter == -1) newFilter.push(id);
        else newFilter.splice(findedActiveFilter, 1);


        dispatch(changeActiveFilters(dispatchActionType)({ ...activeFilters, tags: newFilter }));
        dispatch(updateList(dispatchActionType)());
    }

    const changeSelectValue = (type, value) => {
        if (!value) value = null;

        dispatch(changeActiveFilters(dispatchActionType)({ ...activeFilters, [type]: value }));
        dispatch(updateList(dispatchActionType)());
    }

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
                {'tags' in filters &&
                    <Group header={
                        <Header mode='secondary'>Тэги</Header>
                    }>
                        {filters.tags.map(el => {
                            const isActive = activeFilters.tags && activeFilters.tags.some(activeEl => el.id === activeEl);

                            return (
                                <CellButton
                                    before={isActive && <Icon20Check />}
                                    key={el.id}
                                    onClick={() => changeTag(el.id)}
                                >
                                    {el.name}
                                </CellButton>
                            )
                        })}
                    </Group>
                }
                {'engaged' in filters &&
                    <FormItem top='Статус дизайнера'>
                        <CellButton onClick={() => selectModal.show({
                            header: 'Выберите статус',
                            onClose: () => setActiveModal('filters'),
                            selectList: filters.engaged.map(el => ({ label: el.status, value: el.type })),
                            onChange: (val) => changeSelectValue('engaged', Number(val)),
                            value: activeFilters.engaged
                        })}>
                            {filters.engaged.find(el => el.type == activeFilters.engaged).status}
                        </CellButton>
                    </FormItem>
                }
                {'order' in filters &&
                    <FormItem top='Сортировка дизайнеров'>
                        <CellButton onClick={() => selectModal.show({
                            header: 'Выберите статус',
                            onClose: () => setActiveModal('filters'),
                            selectList: filters.order.map(el => ({ label: el.status, value: el.type })),
                            onChange: (val) => changeSelectValue('order', val),
                            value: activeFilters.order
                        })}>
                            {filters.order.find(el => el.type == activeFilters.order)?.status || filters.order[0].status}
                        </CellButton>
                    </FormItem>
                }
            </ModalPage>
        </>
    )
}

export default FiltersModal;