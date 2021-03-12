export const DESIGNER_CHANGE_ACTIVE_DESIGNER = 'DESIGNER_CHANGE_ACTIVE_DESIGNER';

export const changeActiveDesigner = (designer) => ({
    type: DESIGNER_CHANGE_ACTIVE_DESIGNER,
    payload: designer
})