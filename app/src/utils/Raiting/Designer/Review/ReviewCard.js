const { REACT_APP_API_URL } = process.env;

class ReviewCard {

    constructor(item){
        this._id = item.id;
        this._rating = Number(item.rating);
        this._text = item.text;
        this._userVkId = item.userVkId;
        this._author = item.user;
        this._image = `${REACT_APP_API_URL}/${item.image}`
    }

    getId() {return this._id}
    getRating() {return this._rating}
    getText() {return this._text}
    getUserVkId() {return this._userVkId}
    getAuthor() {return this._author}
    getImage() { return this._image }

}

export default ReviewCard;