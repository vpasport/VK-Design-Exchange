import { parseDateFromServer } from "../../../helpers";

class CommentsCard {

    constructor({ id, text, create_date, user, reply_id, reply_to_vk_id, reply_to }) {
        this._id = id;
        this._text = text;
        this._createDate = parseDateFromServer(create_date);
        this._user = user;
        this._replyId = reply_id;
        this._replyToVkId = reply_to_vk_id;
        this._replyTo = reply_to;
    }

    get id() { return this._id }
    get text() { return this._text }
    get createDate() { return this._createDate }
    get user() { return this._user }
    get userFullName() { return `${this._user.first_name} ${this._user.last_name}` }
    get formatedDate() {
        return new Intl.DateTimeFormat("ru", {
            day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric'
        }).format(this._createDate)
    }

    get replyTo(){ return this._replyTo }
    get replyId(){ return this._replyId }


}

export default CommentsCard;