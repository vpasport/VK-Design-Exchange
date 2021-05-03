import { handleActions } from 'redux-actions';

import { listBlockReducerMap, defaultState } from '../../ListBlock/reducers';

export const commentsReducer = handleActions(
    new Map([...listBlockReducerMap('COMMENTSLIST').entries()]),
    {...defaultState, listFormat: 'l' }
)