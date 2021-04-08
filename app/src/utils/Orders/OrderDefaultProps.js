const { REACT_APP_API_URL } = process.env;

class OrderDefaultProps {
    constructor({id, offer_id, status, status_id, title, preview, price}){
        this.id = id;
        this.offerId = offer_id;
        this.status = status;
        this.statusId = status_id;
        this.title = title;
        this.preview = `${REACT_APP_API_URL}/${preview}`;
        this.price = price;
    }

    getId(){ return this.id }
    getOfferId(){ return this.offerId }
    getStatus(){ return this.status }
    getStatusId(){ return this.statusId }
    getTitle(){ return this.title }
    getPreview(){ return this.preview }
    getPrice(){ return this.price }

    set setStatusId(id){ this.statusId = id }
    set setStatus(status){ this.status = status }

}

export default OrderDefaultProps;