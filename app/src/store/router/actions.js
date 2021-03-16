export const ROUTER_CHANGE_PATH = 'ROUTER_CHANGE_PATH';

export const changeRouterPath = (path) => ({
    type: ROUTER_CHANGE_PATH,
    payload: path
})