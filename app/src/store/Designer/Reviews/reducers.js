import { 
    REVIEWS_CHANGE_LIST_FORMAT, 
    REVIEWS_CHANGE_LIST ,
    REVIEWS_CHANGE_LENGTH,
    REVIEWS_CHANGE_SECOND_LENGTH,
    REVIEWS_CHANGE_FROM_ID,
    REVIEWS_CHANGE_ACTIVE_FILTERS,
    REVIEWS_CHANGE_FILTERS,
    REVIEWS_CHANGE_PREV_USER_ID
} from './actions';

const defaultState = {
    prevUserId: null,
    listFormat: 'l',
    list: [],
    length: null,
    secondLength: 0,
    fromId: null,
    filters: {},
    activeFilters: {}
}

export const reviewsReducer = (state = defaultState, action) => {
    switch (action.type){
        case REVIEWS_CHANGE_PREV_USER_ID: return { ...state, prevUserId: action.payload }
        case REVIEWS_CHANGE_LIST_FORMAT: return { ...state, listFormat: action.payload }
        case REVIEWS_CHANGE_LIST: return { ...state, list: action.payload }
        case REVIEWS_CHANGE_LENGTH: return { ...state, length: action.payload }
        case REVIEWS_CHANGE_SECOND_LENGTH: return { ...state, secondLength: action.payload }
        case REVIEWS_CHANGE_FROM_ID: return { ...state, fromId: action.payload }
        case REVIEWS_CHANGE_FILTERS: return { ...state, filters: action.payload }
        case REVIEWS_CHANGE_ACTIVE_FILTERS: return { ...state, activeFilters: action.payload }
    }

    return state;
}