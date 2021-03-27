import DesignerDefaultProps from "./DesignerDefaultProps";
import axios from 'axios';
import DesignCard from "../../Gallery/Design/DesignCard";
import ReviewCard from './Review/ReviewCard';
import OfferCard from "./Offer/OfferCard";
import { getUrlByJson } from "../../helpers";

const { REACT_APP_API_URL } = process.env;

class Designer extends DesignerDefaultProps {

    constructor(item) {
        super(item.id, item.vk_id, item.rating, item.first_name, item.last_name, item.photo);

        this._bio = item.bio;
    }

    getBio(){ return this._bio }

    async getPortfolio(params) {

        const allParams = getUrlByJson(params)

        const { data } = await axios.get(`${REACT_APP_API_URL}/designers/${this.getId()}/previews${allParams}`);

        if (data.isSuccess) {
            const portfolioCards = data.previews.map(el => new DesignCard(el));

            return {
                list: portfolioCards,
                count: data.count,
                fromId: data.from_id
            }
        }
        else throw new Error('Ошибка при загрузке дизайнера')
    }

    async getReviews() {
        const { data } = await axios.get(`${REACT_APP_API_URL}/designers/${this.getId()}/reviews`);

        if(data.isSuccess){
            const reviewCards = data.reviews.map(el => new ReviewCard(el));

            return {
                list: reviewCards
            }
        }
        else throw new Error('Не удалось загрузить отзывы');
    }

    async getOffers(params) {

        const allParams = getUrlByJson(params);

        const { data } = await axios.get(`${REACT_APP_API_URL}/designers/${this.getId()}/offers${allParams}`);

        if(data.isSuccess){
            const offerCards = data.offers.map(el => new OfferCard(el));

            return {
                list: offerCards,
                count: data.count,
                fromId: data.from_id
            }
        }
        else throw new Error('Не удалось загрузить услуги');
    }

    // async getNewPortfolio(){
    //     await this.setPortfolio();
    //     return this._portfolio;
    // }

    // async getPortfolio(){
    //     return this._portfolio;
    // }

    //getPortfolio() {return this._portfolio}

}

export default Designer;