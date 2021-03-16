class DesignDefaultProps {

    constructor(title, description, id){
        this._title = title;
        this._description = description;
        this._id = id;
    }

    getTitle(){ return this._title }
    getDescription(){ return this._description }
    getId(){ return this._id }

}

export default DesignDefaultProps;