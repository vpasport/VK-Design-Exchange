import { handleActions } from 'redux-actions';

import { defaultState, userListBlockReducerMap } from '../reducers';

export const portfolioReducer = handleActions(
    new Map([...userListBlockReducerMap('PORTFOLIO').entries()]),
    {...defaultState}
)