import DesignCard from './DesignCard';
import axios from 'axios';

const { REACT_APP_API_URL } = process.env;

class Gallery {

    constructor() { }

    async getGallery(from, to, fromId) {

        const url = new URLSearchParams();

        if(from !== null) url.append('from', from);
        if(to !== null) url.append('to', to);
        if(fromId !== null) url.append('from_id', fromId);

        let allParams = url.toString()
        if(allParams.length) allParams = `?${allParams}`;


        console.log(allParams)


        const { data } = await axios.get(`${REACT_APP_API_URL}/portfolio/previews${allParams}`);
        //const { data } = await axios.get(`${REACT_APP_API_URL}/portfolio/previews`);

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

}

export default Gallery;