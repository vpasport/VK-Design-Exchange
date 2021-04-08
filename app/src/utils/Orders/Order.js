import axios from 'axios';
import { store } from '../..';
import { changeList } from '../../store/ListBlock/actions';
import { changeActiveOrderReview } from '../../store/Order/actions';
import OrderDefaultProps from './OrderDefaultProps';

class Order extends OrderDefaultProps {

    constructor(item) {
        super({
            id: item.id,
            offer_id: item.offer_id,
            status: item.status,
            status_id: item.status_id,
            price: item.offer.price,
            title: item.offer.title,
            preview: item.offer.preview
        })

        this.description = item.offer.description;
        this.designer = item.designer;
        this.review = item.review;
    }

    getDescription() { return this.description }
    getDesigner() { return this.designer }
    getReview(){ return this.review }

    set setReview(review){ this.review = review }

    async cancel(comment) {
        const { user: { activeUser }, ordersList: { list } } = store.getState();

        const { data } = await axios.put(`/orders/${this.getId()}/cancel`, {
            url_params: activeUser.getVkUrlParams(),
            comment
        });

        const findedOrderIndex = list.findIndex(el => el.getId() === this.getId());
        list[findedOrderIndex].setStatus = 'Отменен';
        list[findedOrderIndex].setStatusId = 1;
        store.dispatch(changeList('ORDERSLIST')(list));
    }

    async complete() {
        const { user: { activeUser }, ordersList: { list } } = store.getState();

        const { data } = await axios.put(`/orders/${this.getId()}/finish`, {
            url_params: activeUser.getVkUrlParams()
        })

        const findedOrderIndex = list.findIndex(el => el.getId() === this.getId());
        list[findedOrderIndex].setStatus = 'Выполнен';
        list[findedOrderIndex].setStatusId = 5;
        store.dispatch(changeList('ORDERSLIST')(list));
    }

    async sendReview(review){
        const { user: {activeUser}} = store.getState();
        const formData = new FormData();

        review.url_params = activeUser.getVkUrlParams();
        review.order_id = this.getId();

        if(!review.image) delete review.image;

        for(let [key, value] of Object.entries(review))
            formData.append(key, value);

        const { data } = await axios.post('reviews/', formData, {
            headers: { "Content-Type": "multipart/form-data" },
        })

        if(!data.isSuccess) throw new Error('Ошибка при отправке запроса');

        store.dispatch(changeActiveOrderReview(review));
    }

}

export default Order;