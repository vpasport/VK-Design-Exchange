export const REVIEWS_CHANGE_PREV_USER_ID = 'REVIEWS_CHANGE_PREV_USER_ID'
export const REVIEWS_CHANGE_LIST_FORMAT = 'REVIEWS_CHANGE_LIST_FORMAT';
export const REVIEWS_CHANGE_LIST = 'REVIEWS_CHANGE_LIST';
export const REVIEWS_CHANGE_LENGTH = 'REVIEWS_CHANGE_LENGTH';
export const REVIEWS_CHANGE_SECOND_LENGTH = 'REVIEWS_CHANGE_SECOND_LENGTH';
export const REVIEWS_CHANGE_FROM_ID = 'REVIEWS_CHANGE_FROM_ID';
export const REVIEWS_CHANGE_FILTERS = 'REVIEWS_CHANGE_FILTERS';
export const REVIEWS_CHANGE_ACTIVE_FILTERS = 'REVIEWS_CHANGE_ACTIVE_FILTERS';

export const changePrevUserId = (prevUserId) => ({
    type: REVIEWS_CHANGE_PREV_USER_ID,
    payload: prevUserId
})

export const changeListFormat = (listFormat) => ({
    type: REVIEWS_CHANGE_LIST_FORMAT,
    payload: listFormat
})

export const changeList = (list) => ({
    type: REVIEWS_CHANGE_LIST,
    payload: list
})

export const changeLength = (length) => ({
    type: REVIEWS_CHANGE_LENGTH,
    payload: length
})

export const changeSecondLength = (secondLength) => ({
    type: REVIEWS_CHANGE_SECOND_LENGTH,
    payload: secondLength
})

export const changeFromId = (fromId) => ({
    type: REVIEWS_CHANGE_FROM_ID,
    payload: fromId
})

export const changeFilters = (filters) => ({
    type: REVIEWS_CHANGE_FILTERS,
    payload: filters
})

export const changeActiveFilters = (activeFilters) => ({
    type: REVIEWS_CHANGE_ACTIVE_FILTERS,
    payload: activeFilters
})