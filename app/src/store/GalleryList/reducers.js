import { handleActions } from 'redux-actions';

import { listBlockReducerMap, defaultState } from '../ListBlock/reducers';

export const galleryListReducer = handleActions(
    new Map([...listBlockReducerMap('GALLERYLIST').entries()]),
    { ...defaultState, activeFilters: {sort_by: 'popularity&direction=desc'}}
)