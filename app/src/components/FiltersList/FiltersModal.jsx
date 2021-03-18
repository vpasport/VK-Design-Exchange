import React from 'react';
import { ModalPage, Group, ModalPageHeader, PanelHeaderClose, Header, CellButton } from '@vkontakte/vkui';
import { modalContext, sessionContext } from '../../App';
import { useSelector } from 'react-redux';
import { Icon20Check } from '@vkontakte/icons';
import getActionsByType from '../../utils/useList/getActionsByType';

const FiltersModal = ({ id, stateType }) => {

    const { setActiveModal } = modalContext();
    const { isDesktop } = sessionContext();
    const { filters, activeFilters } = useSelector(state => state[stateType]);
    const { changeActiveFilters, changeLength, changeSecondLength, changeFromId, changeIsFetch } = getActionsByType(stateType);

    const updateList = () => {
        changeLength(null);
        changeFromId(null);
        changeSecondLength(0);

        changeIsFetch(true);
    }

    const changeTag = (id) => {
        const newFilter = [...(activeFilters.tags || [])];
        const findedActiveFilter = newFilter.indexOf(id);

        if (findedActiveFilter == -1) newFilter.push(id);
        else newFilter.splice(findedActiveFilter, 1);

        changeActiveFilters({...activeFilters, tags: newFilter});
        updateList();
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