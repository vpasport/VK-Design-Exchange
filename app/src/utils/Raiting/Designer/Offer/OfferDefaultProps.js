import { getApiLink } from "../../../helpers";

class OfferDefaultProps {

    constructor({id, title, preview, price}){
        this._id = id;
        this._title = title;
        this._preview = preview;
        this._price = price;
    }

    getId(){ return this._id }
    getTitle() { return this._title }
    getPreview() { return `${getApiLink(true)}/${this._preview}` }
    getPrice() { return this._price }

}

export default OfferDefaultProps;