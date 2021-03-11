import { DESIGN_CHANGE_ACTIVE_DESIGN } from './actions';

const defaultState = {
    activeDesign: null
}

export const designReducer = (state = defaultState, action) => {
    switch (action.type){
        case DESIGN_CHANGE_ACTIVE_DESIGN: return { ...state, activeDesign: action.payload }
    }

    return state;
}