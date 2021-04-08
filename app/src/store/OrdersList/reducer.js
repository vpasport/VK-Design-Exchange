import { handleActions } from 'redux-actions';

import { listBlockReducerMap, defaultState } from '../ListBlock/reducers';
import { addOrder } from './actions';

export const ordersListReducer = handleActions(
    new Map([
        ...listBlockReducerMap('ORDERSLIST').entries(),
        [addOrder, (state, {payload}) => ({...state, list: [payload, ...state.list]})]
    ]),
    {...defaultState, listFormat: 'l'}
)