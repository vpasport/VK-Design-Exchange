import { createAction } from "redux-actions";

export const changeActiveOrder = createAction('ORDER_CHANGE_ACTIVE_ORDER');
export const changeActiveOrderId = createAction('ORDER_CHANGE_ACTIVE_ORDER_ID');
export const changeActiveOrderStatus = createAction('ORDER_CHANGE_ORDER_STATUS');
export const changeActiveOrderReview = createAction('ORDER_CHANGE_ORDER_REVIEW')