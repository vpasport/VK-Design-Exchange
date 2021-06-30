import { getApiLink, parseDateFromServer, parseDatetoString } from "../helpers";

class OrderDefaultProps {
    constructor({id, offer_id, status, status_id, title, preview, price, update_date, create_date}){
        this.id = id;
        this.offerId = offer_id;
        this.status = status;
        this.statusId = status_id;
        this.title = title;
        this.preview = `${getApiLink(true)}/${preview}`;
        this.price = price;
        this._updateDate = update_date;
        this._createDate = create_date;
    }

    getId(){ return this.id }
    getOfferId(){ return this.offerId }
    getStatus(){ return this.status }
    getStatusId(){ return this.statusId }
    getTitle(){ return this.title }
    getPreview(){ return this.preview }
    getPrice(){ return this.price }

    get updateDate(){
        const date = parseDateFromServer(this._updateDate);
        return parseDatetoString(date);
    }

    get createDate(){
        const date = parseDateFromServer(this._createDate);
        return parseDatetoString(date);
    }

    set setStatusId(id){ this.statusId = id }
    set setStatus(status){ this.status = status }

}

export default OrderDefaultProps;