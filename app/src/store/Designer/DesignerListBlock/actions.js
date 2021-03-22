import { createAction } from 'redux-actions';

export const changePrevUserId = (typeName) => createAction(`${typeName}_CHANGE_PREV_USER_ID`);