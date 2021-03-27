import { combineReducers } from 'redux';
import { galleryListReducer } from './GalleryList/reducers';
import { designReducer } from './Design/reducers';
import { designerListReducer } from './DesignerList/reducers';
import { designerReducer } from './Designer/reducers';
import { pathReducer } from './router/reducers';
import { portfolioReducer } from './Designer/DesignerListBlock/Portfolio/reducers';
import { reviewsReducer } from './Designer/DesignerListBlock/Reviews/reducers';
import { offersReducer } from './Designer/DesignerListBlock/Offers/reducers';
import { offerReducer } from './Designer/DesignerListBlock/Offers/Offer/reducers';

export default combineReducers({
    galleryList: galleryListReducer,
    design: designReducer,
    designerList: designerListReducer,
    designer: designerReducer,
    path: pathReducer,
    portfolio: portfolioReducer,
    reviews: reviewsReducer,
    offers: offersReducer,
    offer: offerReducer
})