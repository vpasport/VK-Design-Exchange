import { combineReducers } from 'redux';
import { galleryListReducer } from './GalleryList/reducers';
import { designReducer } from './Design/reducers';
import { designerListReducer } from './DesignerList/reducers';
import { designerReducer } from './Designer/reducers';
import { pathReducer } from './router/reducers';

export default combineReducers({
    galleryList: galleryListReducer,
    design: designReducer,
    designerList: designerListReducer,
    designer: designerReducer,
    path: pathReducer
})