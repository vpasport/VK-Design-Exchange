import axios from 'axios';
import { store } from '..';
import Design from './Gallery/Design';
import Designer from './Raiting/Designer';
import Offer from './Raiting/Designer/Offer';

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

    if(!obj) return '';

    const url = new URLSearchParams();

    const generateUrl = (obj) => {
        for (let [key, value] of Object.entries(obj)) {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) generateUrl(value)
            else if (value !== null) {
                if (Array.isArray(value) && value.length) url.append(key, value);
                else if (typeof value === 'number' || typeof value === 'string') url.append(key, value);
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
    const { user: {activeUser} } = store.getState();
    const { data } = await axios(`portfolio/work/${id}?vk_id=${activeUser.getId()}`);

    if (data.isSuccess)
        return new Design(data.work);
    else
        throw new Error('Ошибка при загрузке дизайна')
}

const getDesignerInfoById = async (id) => {
    const { data } = await axios.get(`/designers/${id}`);

    if(data.isSuccess){
        return new Designer(data.designer);
    }
    else throw new Error('Не удалось получать данные дизайнера')
}

const getOfferInfoById = async (id) => {
    const { data } = await axios.get(`/offers/${id}`);

    if(data.isSuccess){
        return new Offer(data.offer);
    }
    else throw new Error('Не удалось загрузить услугу');
}

const checkPhotoAndGetSrc = async (photoFile) => {
    return new Promise(resolve => {

        if (!photoFile || !photoFile.length)
            throw ('Выберите фотографию для обработки')
        else {
            const photo = photoFile[0];
            const fileFormat = photo.name.split(".").pop();
            if (fileFormat !== "jpg" && fileFormat !== "jpeg" && fileFormat !== "png" && fileFormat !== "gif" && fileFormat !== "svg")
                throw ('Выбранный файл не является фотографией')


            const reader = new FileReader();
            reader.onload = (e) => resolve([e.target.result, photo]);
            reader.readAsDataURL(photo);
        }
    })
}

const parseDateFromServer = (date) => {
    const formatedDate = new Date((Number(date) + new Date().getTimezoneOffset() * 60) * 1000);
    return formatedDate;
}

export {
    sleep,
    getCardHeightBySize,
    getUrlByJson,
    getDesignInfoById,
    getDesignerInfoById,
    getOfferInfoById,
    checkPhotoAndGetSrc,
    parseDateFromServer
}