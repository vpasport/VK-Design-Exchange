export const DESIGNERLIST_CHANGE_LIST_FORMAT = 'DESIGNERLIST_CHANGE_LIST_FORMAT';
export const DESIGNERLIST_CHANGE_LIST = 'DESIGNERLIST_CHANGE_LIST';
export const DESIGNERLIST_CHANGE_LENGTH = 'DESIGNERLIST_CHANGE_LENGTH';
export const DESIGNERLIST_CHANGE_SECOND_LENGTH = 'DESIGNERLIST_CHANGE_SECOND_LENGTH';
export const DESIGNERLIST_CHANGE_FROM_ID = 'DESIGNERLIST_CHANGE_FROM_ID';
export const DESIGNERLIST_CHANGE_FILTERS = 'DESIGNERLIST_CHANGE_FILTERS';
export const DESIGNERLIST_CHANGE_ACTIVE_FILTERS = 'DESIGNERLIST_CHANGE_ACTIVE_FILTERS';

export const changeListFormat = (listFormat) => ({
    type: DESIGNERLIST_CHANGE_LIST_FORMAT,
    payload: listFormat
})

export const changeList = (list) => ({
    type: DESIGNERLIST_CHANGE_LIST,
    payload: list
})

export const changeLength = (length) => ({
    type: DESIGNERLIST_CHANGE_LENGTH,
    payload: length
})

export const changeSecondLength = (secondLength) => ({
    type: DESIGNERLIST_CHANGE_SECOND_LENGTH,
    payload: secondLength
})

export const changeFromId = (fromId) => ({
    type: DESIGNERLIST_CHANGE_FROM_ID,
    payload: fromId
})

export const changeFilters = (filters) => ({
    type: DESIGNERLIST_CHANGE_FILTERS,
    payload: filters
})

export const changeActiveFilters = (activeFilters) => ({
    type: DESIGNERLIST_CHANGE_ACTIVE_FILTERS,
    payload: activeFilters
})