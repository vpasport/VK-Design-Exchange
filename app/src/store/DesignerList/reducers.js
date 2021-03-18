import {
    DESIGNERLIST_CHANGE_LIST_FORMAT,
    DESIGNERLIST_CHANGE_LIST ,
    DESIGNERLIST_CHANGE_LENGTH,
    DESIGNERLIST_CHANGE_SECOND_LENGTH,
    DESIGNERLIST_CHANGE_FROM_ID,
    DESIGNERLIST_CHANGE_ACTIVE_FILTERS,
    DESIGNERLIST_CHANGE_FILTERS,
    DESIGNERLIST_CHANGE_IS_FETCH
} from './actions';

const defaultState = {
    listFormat: 'l',
    list: [],
    length: null,
    secondLength: 0,
    fromId: null,
    filters: {},
    activeFilters: {},
    isFetch: false
}

export const designerListReducer = (state = defaultState, action) => {
    switch (action.type){
        case DESIGNERLIST_CHANGE_LIST_FORMAT: return { ...state, listFormat: action.payload }
        case DESIGNERLIST_CHANGE_LIST: return { ...state, list: action.payload }
        case DESIGNERLIST_CHANGE_LENGTH: return { ...state, length: action.payload }
        case DESIGNERLIST_CHANGE_SECOND_LENGTH: return { ...state, secondLength: action.payload }
        case DESIGNERLIST_CHANGE_FROM_ID: return { ...state, fromId: action.payload }
        case DESIGNERLIST_CHANGE_FILTERS: return { ...state, filters: action.payload }
        case DESIGNERLIST_CHANGE_ACTIVE_FILTERS: return { ...state, activeFilters: action.payload }
        case DESIGNERLIST_CHANGE_IS_FETCH: return { ...state, isFetch: action.payload }
    }

    return state;
}