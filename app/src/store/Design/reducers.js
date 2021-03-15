import { DESIGN_CHANGE_ACTIVE_DESIGN_ID } from './actions';

const defaultState = {
    activeDesignId: null
}

export const designReducer = (state = defaultState, action) => {
    switch (action.type){
        case DESIGN_CHANGE_ACTIVE_DESIGN_ID: return { ...state, activeDesignId: action.payload }
    }

    return state;
}