import { handleActions } from 'redux-actions';

import { defaultState, userListBlockReducerMap } from '../reducers';

export const reviewsReducer = handleActions(
    new Map([...userListBlockReducerMap('REVIEWS').entries()]),
    {...defaultState, listFormat: 'l'}
)