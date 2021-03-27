import { changeActiveDesignId, changeActiveDesign } from './actions';
import { handleActions } from 'redux-actions';

const defaultState = {
    activeDesignId: null
}

export const designReducer = handleActions(new Map([
    [changeActiveDesignId, (state, {payload}) => ({...state, activeDesignId: payload})],
    [changeActiveDesign, (state, {payload}) => ({...state, activeDesign: payload})]
]), defaultState)