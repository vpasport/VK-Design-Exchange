import { handleActions } from 'redux-actions';

import { listBlockReducerMap, defaultState } from '../ListBlock/reducers';

export const viewedsListReducer = handleActions(
    new Map([...listBlockReducerMap('VIEWEDSLIST').entries()]),
    { ...defaultState}
)