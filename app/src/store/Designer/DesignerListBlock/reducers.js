import { changePrevUserId } from './actions';
import { defaultState as defaultListState, listBlockReducerMap } from '../../ListBlock/reducers';

export const defaultState = {
    ...defaultListState,
    prevUserId: null
}

export const userListBlockReducerMap = (typeName) => new Map([
    [changePrevUserId(typeName), (state, {payload}) => ({ ...state, prevUserId: payload })],
    ...listBlockReducerMap(typeName).entries()
])