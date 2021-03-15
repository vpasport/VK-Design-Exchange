export const DESIGN_CHANGE_ACTIVE_DESIGN_ID = 'DESIGN_CHANGE_ACTIVE_DESIGN_ID';

export const changeActiveDesignId = (designId) => ({
    type: DESIGN_CHANGE_ACTIVE_DESIGN_ID,
    payload: designId
})