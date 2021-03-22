import React, { useMemo } from 'react';
import { ModalPage, Group, ModalPageHeader, PanelHeaderClose, Header, CellButton } from '@vkontakte/vkui';
import { modalContext, sessionContext } from '../../App';
import { useDispatch, useSelector } from 'react-redux';
import { Icon20Check } from '@vkontakte/icons';
import { changeActiveFilters, updateList } from '../../store/ListBlock/actions';

const FiltersModal = ({ id, stateType }) => {

    const { setActiveModal } = modalContext();
    const { isDesktop } = sessionContext();
    const { filters, activeFilters } = useSelector(state => state[stateType]);
    const dispatch = useDispatch();

    const dispatchActionType = useMemo(() => stateType.toUpperCase(), []);

    const changeTag = (id) => {
        const newFilter = [...(activeFilters.tags || [])];
        const findedActiveFilter = newFilter.indexOf(id);

        if (findedActiveFilter == -1) newFilter.push(id);
        else newFilter.splice(findedActiveFilter, 1);


        dispatch(changeActiveFilters(dispatchActionType)({...activeFilters, tags: newFilter}));
        dispatch(updateList(dispatchActionType)());
    }

    return (
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
            <Group header={
                <Header mode='secondary'>Тэги</Header>
            }>
                {'tags' in filters && filters.tags.map(el => {
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
        </ModalPage>
    )
}

export default FiltersModal;