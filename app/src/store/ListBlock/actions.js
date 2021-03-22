import { createAction } from 'redux-actions';

export const changeIsFetch = (typeName) => createAction(`${typeName}_CHANGE_IS_FETCH`);
export const changeList = (typeName) => createAction(`${typeName}_CHANGE_LIST`);
export const changeLength = (typeName) => createAction(`${typeName}_CHANGE_LENGTH`);
export const changeListFormat = (typeName) => createAction(`${typeName}_LIST_FORMAT`);
export const changeSecondLength = (typeName) => createAction(`${typeName}_CHANGE_SECOND_LENGTH`);
export const changeFromId = (typeName) => createAction(`${typeName}_CHANGE_FROM_ID`);
export const changeFilters = (typeName) => createAction(`${typeName}_CHANGE_FILTERS`);
export const changeActiveFilters = (typeName) => createAction(`${typeName}_CHANGE_ACTIVE_FILTERS`);
export const updateList = (typeName) => createAction(`${typeName}_UPDATE_LIST`);