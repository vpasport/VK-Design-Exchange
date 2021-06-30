import { handleActions } from 'redux-actions';

import { listBlockReducerMap, defaultState } from '../ListBlock/reducers';

export const designerListReducer = handleActions(
    new Map([...listBlockReducerMap('DESIGNERLIST').entries()]),
    {
        ...defaultState, 
        listFormat: 'l', 
        activeFilters: {order: 'desc', engaged: null},
        posibleListFormats: ['l', 's']
    }
)