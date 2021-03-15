export const DESIGNER_CHANGE_ACTIVE_DESIGNER_ID = 'DESIGNER_CHANGE_ACTIVE_DESIGNER_ID';

export const changeActiveDesignerId = (designerId) => ({
    type: DESIGNER_CHANGE_ACTIVE_DESIGNER_ID,
    payload: designerId
})