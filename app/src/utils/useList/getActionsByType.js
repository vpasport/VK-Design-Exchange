import * as galleryList from '../../store/GalleryList/actions';

export default (type, dispatch) => {

    const actions = {
        galleryList
    }

    return {
        changeList: (list) => dispatch(actions[type].changeList(list)),
        changeLength: (length) => dispatch(actions[type].changeLength(length)),
        changeFromId: (fromId) => dispatch(actions[type].changeFromId(fromId)),
        changeSecondLength: (secondLength) => dispatch(actions[type].changeSecondLength(secondLength))
    }
}