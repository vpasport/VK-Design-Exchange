import { 
    changeActiveFilters,
    changeFilters,
    changeFromId,
    changeIsFetch,
    changeLength,
    changeList,
    changeListFormat,
    changeSecondLength,
    updateList
} from './actions';

export const defaultState = {
    listFormat: 'm',
    list: [],
    length: null,
    secondLength: 0,
    fromId: null,
    filters: {},
    activeFilters: {},
    isFetch: false
}

export const listBlockReducerMap = (typeName) => new Map([
    [changeActiveFilters(typeName), (state, {payload}) => ({ ...state, activeFilters: payload })],
    [changeFilters(typeName), (state, {payload}) => ({...state, filters: payload})],
    [changeFromId(typeName), (state, {payload}) => ({...state, fromId: payload})],
    [changeIsFetch(typeName), (state, {payload}) => ({...state, isFetch: payload})],
    [changeLength(typeName), (state, {payload}) => ({...state, length: payload})],
    [changeList(typeName), (state, {payload}) => ({...state, list: payload})],
    [changeListFormat(typeName), (state, {payload}) => ({...state, listFormat: payload})],
    [changeSecondLength(typeName), (state, {payload}) => ({...state, secondLength: payload})],
    [updateList(typeName), (state) => ({...state, length: null, fromId: null, secondLength: 0, isFetch: true})]
])