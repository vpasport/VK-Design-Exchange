import axios from "axios";
import { store } from "../../../..";
import { changeList } from "../../../../store/ListBlock/actions";
import { getUrlByJson } from "../../../helpers";
import CommentsCard from "./CommentsCard";

class Comments {

    constructor(id){
        this._id = id;
    }

    get id(){ return this._id }

    async getComments(params){

        const allParams = getUrlByJson(params);

        const { data } = await axios.get(`portfolio/work/${this._id}/comments${allParams}`);

        if (data.isSuccess){
            let designCards = data.comments.map(el => new CommentsCard(el));

            return {
                list: designCards,
                count: Number(data.count),
                fromId: data.from_id
            };
        }
        else
            throw new Error('Ошибка при загрузке комментариев')

    }

    async createComment(text){
        const { user: {activeUser}, commentsList: {list} } = store.getState();

        const { data } = await axios.post(`portfolio/work/${this.id}/comment`, {
            text,
            url_params: activeUser.getVkUrlParams(),
            vk_id: activeUser.getId()
        });

        if(!data.isSuccess) throw new Error('Ошибка при отправке комментария');

        data.comment.user = {
            id: activeUser.getId(),
            first_name: activeUser.getFirstName(),
            last_name: activeUser.getLastName(),
            photo_max: activeUser.getPhoto()
        }

        store.dispatch(changeList('COMMENTSLIST')([new CommentsCard(data.comment), ...list]))
    }

}

export default Comments;