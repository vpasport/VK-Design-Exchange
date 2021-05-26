import { handleActions } from 'redux-actions';

import { listBlockReducerMap, defaultState } from '../ListBlock/reducers';
import { addOrder, changeStatus } from './actions';

export const ordersListReducer = handleActions(
    new Map([
        ...listBlockReducerMap('ORDERSLIST').entries(),
        [addOrder, (state, {payload}) => ({...state, list: [payload, ...state.list]})],
        [changeStatus, (state, {payload}) => ({...state, status: payload})]
    ]),
    {...defaultState, listFormat: 'l', status: null}
)