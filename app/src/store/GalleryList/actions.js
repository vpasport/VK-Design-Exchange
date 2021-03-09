export const GALLERYLIST_CHANGE_LIST_FORMAT = 'GALLERYLIST_CHANGE_LIST_FORMAT';
export const GALLERYLIST_CHANGE_LIST = 'GALLERYLIST_CHANGE_LIST';
export const GALLERYLIST_CHANGE_LENGTH = 'GALLERYLIST_CHANGE_LENGTH';
export const GALLERYLIST_CHANGE_SECOND_LENGTH = 'GALLERYLIST_CHANGE_SECOND_LENGTH';
export const GALLERYLIST_CHANGE_FROM_ID = 'GALLERYLIST_CHANGE_FROM_ID';

export const changeListFormat = (listFormat) => ({
    type: GALLERYLIST_CHANGE_LIST_FORMAT,
    payload: listFormat
})

export const changeList = (list) => ({
    type: GALLERYLIST_CHANGE_LIST,
    payload: list
})

export const changeLength = (length) => ({
    type: GALLERYLIST_CHANGE_LENGTH,
    payload: length
})

export const changeSecondLength = (secondLength) => ({
    type: GALLERYLIST_CHANGE_SECOND_LENGTH,
    payload: secondLength
})

export const changeFromId = (fromId) => ({
    type: GALLERYLIST_CHANGE_FROM_ID,
    payload: fromId
})