import { DESIGNER_CHANGE_ACTIVE_DESIGNER_ID, DESIGNER_CHANGE_ACTIVE_DESIGNER } from './actions';

const defaultState = {
    activeDesignerId: null,
    activeDesigner: null
}

export const designerReducer = (state = defaultState, action) => {
    switch (action.type){
        case DESIGNER_CHANGE_ACTIVE_DESIGNER_ID: return { ...state, activeDesignerId: action.payload };
        case DESIGNER_CHANGE_ACTIVE_DESIGNER: return { ...state, activeDesigner: action.payload }
    }

    return state;
}