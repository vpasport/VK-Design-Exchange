import axios from 'axios';
import { getUrlByJson } from '../helpers';
import DesignerCard from './Designer/DesignerCard';

class Raiting {

    constructor(){}

    async getRaiting(params){

        const allParams = getUrlByJson(params);

        const { data } = await axios.get(`designers/${allParams}`);

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

    async getFilters(){

        const filters = [
            {
                name: 'Статус дизайнера',
                header: 'Выберите статус',
                type: 'engaged',
                componentName: 'ModalRadioSelect',
                filters: [
                    {status: 'Все дизайнеры', type: null},
                    {status: 'Свободные', type: 1},
                    {status: 'Занятые', type: 2}
                ]
            },
            {
                name: 'Сортировка дизайнеров',
                header: 'Тип сортировки',
                type: 'order',
                componentName: 'ModalRadioSelect',
                filters: [
                    {status: 'По убыванию рейтинга', type: 'desc'},
                    {status: 'По возрастанию рейтинга', type: 'asc'}
                ]
            }
        ]

        return filters;
    }

}

export default Raiting;