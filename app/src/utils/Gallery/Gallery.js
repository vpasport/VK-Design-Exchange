import DesignCard from './DesignCard';
import axios from 'axios';

const { REACT_APP_API_URL } = process.env;

class Gallery {

    constructor() { }

    async getGallery() {

        const { data } = await axios.get(`${REACT_APP_API_URL}/portfolio/previews`);

        if (data.isSuccess)
            return data.previews.map(el => new DesignCard(el));
        else
            throw new Error('Ошибка при загрузке галереи')

    }

}

export default Gallery;