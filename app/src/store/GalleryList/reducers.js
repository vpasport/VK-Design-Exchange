import { 
    GALLERYLIST_CHANGE_LIST_FORMAT, 
    GALLERYLIST_CHANGE_LIST ,
    GALLERYLIST_CHANGE_LENGTH,
    GALLERYLIST_CHANGE_SECOND_LENGTH,
    GALLERYLIST_CHANGE_FROM_ID
} from './actions';

const defaultState = {
    listFormat: 'm',
    list: [],
    length: null,
    secondLength: 0,
    fromId: null
}

export const galleryListReducer = (state = defaultState, action) => {
    switch (action.type){
        case GALLERYLIST_CHANGE_LIST_FORMAT: return { ...state, listFormat: action.payload }
        case GALLERYLIST_CHANGE_LIST: return { ...state, list: action.payload }
        case GALLERYLIST_CHANGE_LENGTH: return { ...state, length: action.payload }
        case GALLERYLIST_CHANGE_SECOND_LENGTH: return { ...state, secondLength: action.payload }
        case GALLERYLIST_CHANGE_FROM_ID: return { ...state, fromId: action.payload }
    }

    return state;
}