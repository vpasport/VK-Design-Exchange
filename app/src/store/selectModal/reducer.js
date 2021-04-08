import { changeModalParams } from './actions';
import { handleActions } from 'redux-actions';

const defaultState = {
    params: null
}

export const selectModalReducer = handleActions(new Map([
    [changeModalParams, (state, {payload}) => ({...state, params: payload})]
]), defaultState)