import DesignCard from './Design/DesignCard';
import axios from 'axios';
import { getUrlByJson } from '../helpers';

class Gallery {

    constructor() { }

    async getGallery(params) {

        const allParams = getUrlByJson(params);

        const { data } = await axios.get(`portfolio/previews${allParams}`);

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

    async getFilters(){
        
        const { data } = await axios.get(`tags`);

        if(!data.isSuccess) throw new Error ('Ошибка при загрузке тегов');
        
        return [
            {
                name: 'Сортировать по',
                header: 'Сортировать по',
                type: 'sort_by',
                componentName: 'ModalRadioSelect',
                filters: [
                    {status: 'Популярности', type: 'popularity&direction=desc'},
                    {status: 'Дате публикации (сначала новые)', type: 'id&direction=desc'},
                    {status: 'Дате публикации (сначала старые)', type: 'id&direction=asc'},
                    {status: 'Лайкам (по убыванию)', type: 'likes&direction=desc'},
                    {status: 'Лайкам (по возрастанию)', type: 'likes&direction=asc'},
                    {status: 'Просмотрам (по убыванию)', type: 'views&direction=desc'},
                    {status: 'Просмотрам (по возрастанию)', type: 'views&direction=asc'},
                ]
            },
            {
                name: 'Теги',
                type: 'tags',
                componentName: 'CellButtonsList',
                filters: data.tags
            }
        ];
    }

}

export default Gallery;