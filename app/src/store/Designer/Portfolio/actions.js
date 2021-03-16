export const PORTFOLIO_CHANGE_PREV_USER_ID = 'PORTFOLIO_CHANGE_PREV_USER_ID'
export const PORTFOLIO_CHANGE_LIST_FORMAT = 'PORTFOLIO_CHANGE_LIST_FORMAT';
export const PORTFOLIO_CHANGE_LIST = 'PORTFOLIO_CHANGE_LIST';
export const PORTFOLIO_CHANGE_LENGTH = 'PORTFOLIO_CHANGE_LENGTH';
export const PORTFOLIO_CHANGE_SECOND_LENGTH = 'PORTFOLIO_CHANGE_SECOND_LENGTH';
export const PORTFOLIO_CHANGE_FROM_ID = 'PORTFOLIO_CHANGE_FROM_ID';
export const PORTFOLIO_CHANGE_FILTERS = 'PORTFOLIO_CHANGE_FILTERS';
export const PORTFOLIO_CHANGE_ACTIVE_FILTERS = 'PORTFOLIO_CHANGE_ACTIVE_FILTERS';

export const changePrevUserId = (prevUserId) => ({
    type: PORTFOLIO_CHANGE_PREV_USER_ID,
    payload: prevUserId
})

export const changeListFormat = (listFormat) => ({
    type: PORTFOLIO_CHANGE_LIST_FORMAT,
    payload: listFormat
})

export const changeList = (list) => ({
    type: PORTFOLIO_CHANGE_LIST,
    payload: list
})

export const changeLength = (length) => ({
    type: PORTFOLIO_CHANGE_LENGTH,
    payload: length
})

export const changeSecondLength = (secondLength) => ({
    type: PORTFOLIO_CHANGE_SECOND_LENGTH,
    payload: secondLength
})

export const changeFromId = (fromId) => ({
    type: PORTFOLIO_CHANGE_FROM_ID,
    payload: fromId
})

export const changeFilters = (filters) => ({
    type: PORTFOLIO_CHANGE_FILTERS,
    payload: filters
})

export const changeActiveFilters = (activeFilters) => ({
    type: PORTFOLIO_CHANGE_ACTIVE_FILTERS,
    payload: activeFilters
})