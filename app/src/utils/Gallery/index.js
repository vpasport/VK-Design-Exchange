import DesignCard from './Design/DesignCard';
import axios from 'axios';
import { getUrlByJson } from '../helpers';

const { REACT_APP_API_URL } = process.env;

class Gallery {

    constructor() { }

    async getGallery(params) {

        const allParams = getUrlByJson(params);

        const { data } = await axios.get(`${REACT_APP_API_URL}/portfolio/previews${allParams}`);

        if (data.isSuccess){
            let designCards = data.previews.map(el => new DesignCard(el));

            const { from_id: fromId } = data;

            return {
                list: designCards,
                count: Number(data.count),
                fromId
            };
        }
        else
            throw new Error('Ошибка при загрузке галереи')

    }

    async getFilters(){
        
        const { data } = await axios.get(`${REACT_APP_API_URL}/tags`);

        if(data.isSuccess) return data;
        else throw new Error ('Ошибка при загрузке тегов');
        

    }

}

export default Gallery;