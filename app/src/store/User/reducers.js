import { changeUser } from './actions';
import { handleActions } from 'redux-actions';

const defaultState = {
    activeUser: null
}

export const userReducer = handleActions(new Map([
    [changeUser, (state, {payload}) => ({...state, activeUser: payload})],
]), defaultState)