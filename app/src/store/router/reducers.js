import { ROUTER_CHANGE_PATH } from './actions';

const defaultState = {
    path: [['gallery', 'gallery']]
}

export const pathReducer = (state = defaultState, action) => {
    switch (action.type) {
        case ROUTER_CHANGE_PATH: return { ...state, path: action.payload }
    }

    return state;
}