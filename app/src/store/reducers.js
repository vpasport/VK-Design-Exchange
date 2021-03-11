import { combineReducers } from 'redux';
import { galleryListReducer } from './GalleryList/reducers';
import { designReducer } from './Design/reducers';

export default combineReducers({
    galleryList: galleryListReducer,
    design: designReducer
})