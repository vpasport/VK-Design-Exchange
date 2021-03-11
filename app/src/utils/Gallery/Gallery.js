import DesignCard from './DesignCard';
import axios from 'axios';

const { REACT_APP_API_URL } = process.env;

class Gallery {

    constructor() { }

    async getGallery(from, to, fromId, activeFilters) {

        const url = new URLSearchParams();

        if(from !== null) url.append('from', from);
        if(to !== null) url.append('to', to);
        if(fromId !== null) url.append('from_id', fromId);
        if(activeFilters.length) url.append('tags', activeFilters)

        let allParams = url.toString()
        if(allParams.length) allParams = `?${allParams}`;


        console.log(decodeURIComponent(allParams))


        const { data } = await axios.get(`${REACT_APP_API_URL}/portfolio/previews${decodeURIComponent(allParams)}`);
        //const { data } = await axios.get(`${REACT_APP_API_URL}/portfolio/previews`);

        if (data.isSuccess){
            let designCards = data.previews.map(el => new DesignCard(el));

            console.log(data)

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