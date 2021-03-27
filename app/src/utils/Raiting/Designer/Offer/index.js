import OfferDefaultProps from './OfferDefaultProps';

class Offer extends OfferDefaultProps {

    constructor(item){
        super(item);

        this._description = item.description;
        this._author = item.author;
    }

    getDesctiption() { return this._description }
    getAuthor() {return this._author} 

}

export default Offer;