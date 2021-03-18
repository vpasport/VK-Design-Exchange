import { 
    PORTFOLIO_CHANGE_LIST_FORMAT, 
    PORTFOLIO_CHANGE_LIST ,
    PORTFOLIO_CHANGE_LENGTH,
    PORTFOLIO_CHANGE_SECOND_LENGTH,
    PORTFOLIO_CHANGE_FROM_ID,
    PORTFOLIO_CHANGE_ACTIVE_FILTERS,
    PORTFOLIO_CHANGE_FILTERS,
    PORTFOLIO_CHANGE_PREV_USER_ID,
    PORTFOLIO_CHANGE_IS_FETCH
} from './actions';

const defaultState = {
    prevUserId: null,
    listFormat: 'm',
    list: [],
    length: null,
    secondLength: 0,
    fromId: null,
    filters: {},
    activeFilters: {},
    isFetch: false
}

export const portfolioReducer = (state = defaultState, action) => {
    switch (action.type){
        case PORTFOLIO_CHANGE_PREV_USER_ID: return { ...state, prevUserId: action.payload }
        case PORTFOLIO_CHANGE_LIST_FORMAT: return { ...state, listFormat: action.payload }
        case PORTFOLIO_CHANGE_LIST: return { ...state, list: action.payload }
        case PORTFOLIO_CHANGE_LENGTH: return { ...state, length: action.payload }
        case PORTFOLIO_CHANGE_SECOND_LENGTH: return { ...state, secondLength: action.payload }
        case PORTFOLIO_CHANGE_FROM_ID: return { ...state, fromId: action.payload }
        case PORTFOLIO_CHANGE_FILTERS: return { ...state, filters: action.payload }
        case PORTFOLIO_CHANGE_ACTIVE_FILTERS: return { ...state, activeFilters: action.payload }
        case PORTFOLIO_CHANGE_IS_FETCH: return { ...state, isFetch: action.payload }
    }

    return state;
}