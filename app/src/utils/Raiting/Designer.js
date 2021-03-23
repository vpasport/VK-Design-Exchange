import DesignerDefaultProps from "./DesignerDefaultProps";
import axios from 'axios';
import DesignCard from "../Gallery/DesignCard";
import ReviewCard from './ReviewCard';

const { REACT_APP_API_URL } = process.env;

class Designer extends DesignerDefaultProps {

    constructor(item) {
        //console.log(item)
        super(item.id, item.vk_id, item.rating, item.first_name, item.last_name, item.photo);

        this._bio = item.bio;
        
        //this.setPortfolio();
    }

    getBio(){ return this._bio }

    async getPortfolio() {
        const { data } = await axios.get(`${REACT_APP_API_URL}/designers/${this.getId()}/previews`);

        if (data.isSuccess) {
            const portfolioCards = data.previews.map(el => new DesignCard(el));

            return {
                list: portfolioCards
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