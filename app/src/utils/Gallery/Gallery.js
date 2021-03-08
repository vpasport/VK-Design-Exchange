import DesignCard from './DesignCard';
import axios from 'axios';

const { REACT_APP_API_URL } = process.env;

class Gallery {

    constructor() { }

    async getGallery(from, to) {

        const url = new URLSearchParams();

        if(from !== null) url.append('from', from);
        if(to !== null) url.append('to', to);

        let allParams = url.toString()
        if(allParams.length) allParams = `?${allParams}`


        const { data } = await axios.get(`${REACT_APP_API_URL}/portfolio/previews${allParams}`);

        if (data.isSuccess){
            let designCards = data.previews.map(el => new DesignCard(el));

            return {
                list: designCards,
                count: Number(data.count)
            };
        }
        else
            throw new Error('Ошибка при загрузке галереи')

    }

}

export default Gallery;