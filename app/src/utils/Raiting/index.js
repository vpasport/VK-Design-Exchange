import axios from 'axios';
import { getUrlByJson } from '../helpers';
import DesignerCard from './Designer/DesignerCard';

const { REACT_APP_API_URL } = process.env;

class Raiting {

    constructor(){}

    async getRaiting(params){

        const allParams = getUrlByJson(params);

        const { data } = await axios.get(`${REACT_APP_API_URL}/designers/${allParams}`);

        if( data.isSuccess ){

            const raitingCards = data.designers.map(el => new DesignerCard(el));

            return {
                list: raitingCards,
                count: data.count,
                fromId: data.from_id
            }
        }
        else throw new Error('Ошибка при загрузке пользователей')

    }

}

export default Raiting;