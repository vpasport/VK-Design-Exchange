import { combineReducers } from 'redux';
import { galleryListReducer } from './GalleryList/reducers';

export default combineReducers({
    galleryList: galleryListReducer
})