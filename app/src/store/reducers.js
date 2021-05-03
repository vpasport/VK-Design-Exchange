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
import { ordersListReducer } from './OrdersList/reducer';
import { orderReducer } from './Order/reducers';
import { userReducer } from './User/reducers';
import { selectModalReducer } from './selectModal/reducer';
import { commentsReducer } from './Design/Comments/reducer';

export default combineReducers({
    galleryList: galleryListReducer,
    design: designReducer,
    designerList: designerListReducer,
    designer: designerReducer,
    path: pathReducer,
    portfolio: portfolioReducer,
    reviews: reviewsReducer,
    offers: offersReducer,
    offer: offerReducer,
    ordersList: ordersListReducer,
    order: orderReducer,
    user: userReducer,
    selectModal: selectModalReducer,
    commentsList: commentsReducer
})