import { 
    GALLERYLIST_CHANGE_LIST_FORMAT, 
    GALLERYLIST_CHANGE_LIST ,
    GALLERYLIST_CHANGE_LENGTH,
    GALLERYLIST_CHANGE_SECOND_LENGTH,
    GALLERYLIST_CHANGE_FROM_ID,
    GALLERYLIST_CHANGE_ACTIVE_FILTERS,
    GALLERYLIST_CHANGE_FILTERS,
    GALLERYLIST_CHANGE_IS_FETCH
} from './actions';

const defaultState = {
    listFormat: 'm',
    list: [],
    length: null,
    secondLength: 0,
    fromId: null,
    filters: {},
    activeFilters: {},
    isFetch: false
}

export const galleryListReducer = (state = defaultState, action) => {
    switch (action.type){
        case GALLERYLIST_CHANGE_LIST_FORMAT: return { ...state, listFormat: action.payload }
        case GALLERYLIST_CHANGE_LIST: return { ...state, list: action.payload }
        case GALLERYLIST_CHANGE_LENGTH: return { ...state, length: action.payload }
        case GALLERYLIST_CHANGE_SECOND_LENGTH: return { ...state, secondLength: action.payload }
        case GALLERYLIST_CHANGE_FROM_ID: return { ...state, fromId: action.payload }
        case GALLERYLIST_CHANGE_FILTERS: return { ...state, filters: action.payload }
        case GALLERYLIST_CHANGE_ACTIVE_FILTERS: return { ...state, activeFilters: action.payload }
        case GALLERYLIST_CHANGE_IS_FETCH: return { ...state, isFetch: action.payload }
    }

    return state;
}