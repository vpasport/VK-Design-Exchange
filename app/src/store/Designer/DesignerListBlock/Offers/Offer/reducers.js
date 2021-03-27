import { handleActions } from 'redux-actions';
import { changeActiveOffer, changeActiveOfferId } from './actions';

const defaultState = {
    activeOffer: null,
    activeOfferId: null
}

export const offerReducer = handleActions(new Map([
    [changeActiveOfferId, (state, {payload}) => ({...state, activeOfferId: payload})],
    [changeActiveOffer, (state, {payload}) => ({...state, activeOffer: payload})]
]), defaultState)