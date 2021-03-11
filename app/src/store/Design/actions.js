export const DESIGN_CHANGE_ACTIVE_DESIGN = 'DESIGN_CHANGE_ACTIVE_DESIGN';

export const changeActiveDesign = (design) => ({
    type: DESIGN_CHANGE_ACTIVE_DESIGN,
    payload: design
})