import { handleActions } from 'redux-actions';
import { changeActiveDesigner, changeActiveDesignerId } from './actions';

const defaultState = {
    activeDesignerId: null,
    activeDesigner: null
}

export const designerReducer = handleActions(new Map([
    [changeActiveDesigner, (state, {payload}) => ({...state, activeDesigner: payload})],
    [changeActiveDesignerId, (state, {payload}) => ({...state, activeDesignerId: payload})]
]), defaultState)