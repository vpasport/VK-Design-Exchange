import { DESIGNER_CHANGE_ACTIVE_DESIGNER_ID } from './actions';

const defaultState = {
    activeDesignerId: null
}

export const designerReducer = (state = defaultState, action) => {
    switch (action.type){
        case DESIGNER_CHANGE_ACTIVE_DESIGNER_ID: return { ...state, activeDesignerId: action.payload }
    }

    return state;
}