export const DESIGNER_CHANGE_ACTIVE_DESIGNER_ID = 'DESIGNER_CHANGE_ACTIVE_DESIGNER_ID';
export const DESIGNER_CHANGE_ACTIVE_DESIGNER = 'DESIGNER_CHANGE_ACTIVE_DESIGNER';

export const changeActiveDesignerId = (designerId) => ({
    type: DESIGNER_CHANGE_ACTIVE_DESIGNER_ID,
    payload: designerId
})

export const changeActiveDesigner = (designer) => ({
    type: DESIGNER_CHANGE_ACTIVE_DESIGNER,
    payload: designer
})