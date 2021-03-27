import axios from 'axios';
import DesignerCard from './Designer/DesignerCard';

const { REACT_APP_API_URL } = process.env;

class Raiting {

    constructor(){}

    async getRaiting(){

        const { data } = await axios.get(`${REACT_APP_API_URL}/designers`);

        if( data.isSuccess ){

            const raitingCards = data.designers.map(el => new DesignerCard(el));

            return {
                list: raitingCards
            }
        }
        else throw new Error('Ошибка при загрузке пользователей')

    }

}

export default Raiting;