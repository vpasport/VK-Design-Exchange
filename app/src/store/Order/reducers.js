import { changeActiveOrder, changeActiveOrderId, changeActiveOrderStatus, changeActiveOrderReview } from './actions';
import { handleActions } from 'redux-actions';

const defaultState = {
    activeOrderId: null,
    activeOrder: null
}

export const orderReducer = handleActions(new Map([
    [changeActiveOrderId, (state, {payload}) => ({...state, activeOrderId: payload})],
    [changeActiveOrder, (state, {payload}) => ({...state, activeOrder: payload})],
    [changeActiveOrderStatus, (state, {payload}) => {
        state.activeOrder.setStatusId = payload.statusId;
        state.activeOrder.setStatus = payload.status;
        return {...state }
    }],
    [changeActiveOrderReview, (state, {payload}) => {
        state.activeOrder.setReview = payload;
        return {...state}
    }]
]), defaultState)