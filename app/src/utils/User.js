import bridge from '@vkontakte/vk-bridge';
import axios from 'axios';
import { store } from '..';
import { addOrder } from '../store/OrdersList/actions';
import DesignCard from './Gallery/Design/DesignCard';
import { getUrlByJson } from './helpers';
import Order from './Orders/Order';
import OrderCard from './Orders/OrderCard';

class User {

    constructor(user, vkUrlParams, banned) {
        this.id = user.id;
        this.firstName = user.first_name;
        this.lastName = user.last_name;
        this.photo = user.photo_200;
        this.vkUrlParams = vkUrlParams.slice(1);
        this._banned = banned;
    }

    getId() {
        return this.id;
    }

    getFirstName() {
        return this.firstName;
    }

    getLastName() {
        return this.lastName;
    }

    getPhoto() {
        return this.photo;
    }

    get banned() { return this._banned }

    getVkUrlParams() { return this.vkUrlParams }

    async getFavorites(params){

        let allParams = getUrlByJson(params);

        if(allParams.length) allParams = allParams.replace('?', '&');

        const {data} = await axios.get(`/favorites?${this.getVkUrlParams()}${allParams}`);

        if(!data.isSuccess) throw new Error('Ошибка при загрузке избранных');

        const favorites = data.previews.map(el => new DesignCard(el));

        return {
            list: favorites,
            count: Number(data.count),
            fromId: data.from_id
        }
    }

    getOrders(startFilters) {

        return async (newFilters) => {

            newFilters = {...startFilters, ...newFilters};
            let allParams = getUrlByJson(newFilters);

            if(allParams.length) allParams = allParams.replace('?', '&');

            const { data } = await axios.get(`orders/?${this.getVkUrlParams()}${allParams}`);

            if (data.isSuccess) {
                const orders = data.orders.map(el => new OrderCard(el));

                return {
                    list: orders,
                    count: Number(data.count),
                    fromId: data.from_id
                }
            }
            else throw new Error('Ошибка при загрузке заказов')
        }
    }

    async createOrder(offerId) {
        const { data } = await axios.post('orders', {
            offer_id: offerId,
            url_params: this.getVkUrlParams()
        })

        if (data.isSuccess) {
            // const order = new OrderCard(data.order);
            // store.dispatch(addOrder(order));
            return true;
        }
        else throw new Error('Ошибка при создании заказа')
    }

    async getOrder(orderId) {
        const { data } = await axios.get(`orders/${orderId}?${this.getVkUrlParams()}`);

        if (data.isSuccess) {
            const order = new Order(data.order);
            return order;
        }
        else throw new Error('Ошибка при загрузке заказа');
    }

    async getViewed(params){
        let allParams = getUrlByJson(params);

        if(allParams.length) allParams = allParams.replace('?', '&');

        const {data} = await axios.get(`users/viewed?${this.getVkUrlParams()}${allParams}`);

        if(!data.isSuccess) throw new Error('Ошибка при загрузке просмотренных работ');

        const vieweds = data.previews.map(el => new DesignCard(el));

        return {
            list: vieweds,
            count: Number(data.count),
            fromId: data.from_id
        }
    }

}

export default User;