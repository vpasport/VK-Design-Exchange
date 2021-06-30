import DesignerDefaultProps from "./DesignerDefaultProps";
import axios from 'axios';
import DesignCard from "../../Gallery/Design/DesignCard";
import ReviewCard from './Review/ReviewCard';
import OfferCard from "./Offer/OfferCard";
import { getUrlByJson } from "../../helpers";

class Designer extends DesignerDefaultProps {

    constructor(item) {
        super(item.id, item.vk_id, item.rating, item.first_name, item.last_name, item.photo, item.engaged, item.specializations, item.reviewsCount);

        this._bio = item.bio;
        this._engaged = item.engaged;
        this._engagedDate = item.engaged_date && new Date((item.engaged_date + new Date().getTimezoneOffset() * 60) * 1000).toLocaleDateString("ru-RU");
        this._offersCount = item.offers_count;
        this._portfoliosCount = item.portfolios_count;
        this._reviewsCount = item.reviews_count;
    }

    getBio(){ return this._bio }
    getEngaged(){ return this._engaged }
    getEngagedDate(){ return this._engagedDate }

    get offersCount(){ return this._offersCount }
    get portfoliosCount(){ return this._portfoliosCount }

    async getPortfolio(params) {

        const allParams = getUrlByJson(params)

        const { data } = await axios.get(`designers/${this.getId()}/previews${allParams}`);

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
        const { data } = await axios.get(`designers/${this.getId()}/reviews`);

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

        const { data } = await axios.get(`designers/${this.getId()}/offers${allParams}`);

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

}

export default Designer;