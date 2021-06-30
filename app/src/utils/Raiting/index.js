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

        const { data } = await axios.get(`/specializations`);

        if(!data.isSuccess) throw new Error('Ошибка при загрузке фильтров');

        const filters = [
            {
                name: 'Статус дизайнера',
                type: 'engaged',
                componentName: 'RadioList',
                filters: [
                    {status: 'Все дизайнеры', type: null},
                    {status: 'Свободные', type: 1},
                    {status: 'Занятые', type: 2}
                ]
            },
            {
                name: 'Сортировка дизайнеров',
                type: 'order',
                componentName: 'RadioList',
                filters: [
                    {status: 'По убыванию рейтинга', type: 'desc'},
                    {status: 'По возрастанию рейтинга', type: 'asc'}
                ]
            },
            {
                name: 'Специализация',
                type: 'specializations',
                componentName: 'CheckboxList',
                filters: data.specializations
            }
        ]

        return filters;
    }

}

export default Raiting;