class DesignDefaultProps {

    constructor(title, description, id){
        this._title = title;
        this._id = id;
    }

    getTitle(){ return this._title }
    getId(){ return this._id }

}

export default DesignDefaultProps;