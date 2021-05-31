import { handleActions } from 'redux-actions';

import { listBlockReducerMap, defaultState } from '../ListBlock/reducers';

export const favoritesListReducer = handleActions(
    new Map([...listBlockReducerMap('FAVORITESLIST').entries()]),
    { ...defaultState}
)