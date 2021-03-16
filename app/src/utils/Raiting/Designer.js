import DesignerDefaultProps from "./DesignerDefaultProps";
import axios from 'axios';
import DesignCard from "../Gallery/DesignCard";

const { REACT_APP_API_URL } = process.env;

class Designer extends DesignerDefaultProps {

    constructor(item) {
        super(item.id, item.vk_id, item.rating, item.first_name, item.last_name, item.photo);

        this._experience = item.experience;
        this._specialisation = item.specialisation;
        
        //this.setPortfolio();
    }

    getExperience() { return this._experience }
    getSpecialisation() { return this._specialisation }

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