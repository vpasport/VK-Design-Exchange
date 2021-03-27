class ReviewCard {

    constructor(item){
        this._id = item.id;
        this._rating = Number(item.rating);
        this._text = item.text;
        this._userVkId = item.userVkId;
        this._author = item.user;
    }

    getId() {return this._id}
    getRating() {return this._rating}
    getText() {return this._text}
    getUserVkId() {return this._userVkId}
    getAuthor() {return this._author}

}

export default ReviewCard;