import { DESIGNER_CHANGE_ACTIVE_DESIGNER } from './actions';

const defaultState = {
    activeDesigner: null
}

export const designerReducer = (state = defaultState, action) => {
    switch (action.type){
        case DESIGNER_CHANGE_ACTIVE_DESIGNER: return { ...state, activeDesigner: action.payload }
    }

    return state;
}