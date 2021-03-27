import axios from 'axios';
import Design from './Gallery/Design';
import Designer from './Raiting/Designer';
import Offer from './Raiting/Designer/Offer';

const { REACT_APP_API_URL } = process.env;

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

const getCardHeightBySize = (size) => {
    switch (size) {
        case 'm': return 125;
        case 'l': return 250;
    }
}

const getUrlByJson = (obj) => {
    const url = new URLSearchParams();

    const generateUrl = (obj) => {
        for (let [key, value] of Object.entries(obj)) {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) generateUrl(value)
            else if (value !== null) {
                if (Array.isArray(value) && value.length) url.append(key, value);
                else if (typeof value === 'number') url.append(key, value);
            }
        }
    }

    generateUrl(obj);

    let allParams = url.toString();
    if (allParams.length) allParams = `?${allParams}`;

    allParams = decodeURIComponent(allParams);

    return allParams;
}

const getDesignInfoById = async (id) => {
    const { data } = await axios(`${REACT_APP_API_URL}/portfolio/work/${id}`);

    if (data.isSuccess)
        return new Design(data.work);
    else
        throw new Error('Ошибка при загрузке дизайна')
}

const getDesignerInfoById = async (id) => {
    const { data } = await axios.get(`${REACT_APP_API_URL}/designers/${id}`);

    if(data.isSuccess){
        return new Designer(data.designer);
    }
    else throw new Error('Не удалось получать данные дизайнера')
}

const getOfferInfoById = async (id) => {
    const { data } = await axios.get(`${REACT_APP_API_URL}/offers/${id}`);

    if(data.isSuccess){
        return new Offer(data.offer);
    }
    else throw new Error('Не удалось загрузить услугу');
}

export {
    sleep,
    getCardHeightBySize,
    getUrlByJson,
    getDesignInfoById,
    getDesignerInfoById,
    getOfferInfoById
}