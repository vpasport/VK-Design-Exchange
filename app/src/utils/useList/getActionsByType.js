import * as galleryList from '../../store/GalleryList/actions';
import * as designerList from '../../store/DesignerList/actions';
import * as portfolio from '../../store/Designer/Portfolio/actions';
import * as reviews from '../../store/Designer/Reviews/actions';

export default (type, dispatch) => {

    const actions = {
        galleryList,
        designerList,
        portfolio,
        reviews
    }

    return {
        changeList: (list) => dispatch(actions[type].changeList(list)),
        changeLength: (length) => dispatch(actions[type].changeLength(length)),
        changeFromId: (fromId) => dispatch(actions[type].changeFromId(fromId)),
        changeSecondLength: (secondLength) => dispatch(actions[type].changeSecondLength(secondLength)),
        changeFilters: (filters) => dispatch(actions[type].changeFilters(filters)),
        changeActiveFilters: (activeFilters) => dispatch(actions[type].changeActiveFilters(activeFilters)),
        changeListFormat: (listFormat) => dispatch(actions[type].changeListFormat(listFormat))
    }
}