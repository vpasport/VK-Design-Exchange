import DesignCard from './Design/DesignCard';
import axios from 'axios';
import { getUrlByJson } from '../helpers';

class Gallery {

    constructor() { }

    async getGallery(params) {

        const allParams = getUrlByJson(params);

        const { data } = await axios.get(`portfolio/previews${allParams}`);

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
        
        const { data } = await axios.get(`tags`);

        if(data.isSuccess) return data;
        else throw new Error ('Ошибка при загрузке тегов');
        

    }

}

export default Gallery;