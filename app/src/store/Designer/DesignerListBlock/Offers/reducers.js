import { handleActions } from 'redux-actions';

import { defaultState, userListBlockReducerMap } from '../reducers';

export const offersReducer = handleActions(
    new Map([...userListBlockReducerMap('OFFERS').entries()]),
    {...defaultState}
)