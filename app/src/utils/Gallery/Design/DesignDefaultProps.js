class DesignDefaultProps {

    constructor(title, id, preview){
        this._title = title;
        this._id = id;
        this._preview = preview;
    }

    getTitle(){ return this._title }
    getId(){ return this._id }

    get preview(){return this._preview}

}

export default DesignDefaultProps;