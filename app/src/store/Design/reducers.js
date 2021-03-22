import { changeActiveDesignId } from './actions';
import { handleActions } from 'redux-actions';

const defaultState = {
    activeDesignId: null
}

export const designReducer = handleActions(new Map([
    [changeActiveDesignId, (state, {payload}) => ({...state, activeDesignId: payload})],
]), defaultState)