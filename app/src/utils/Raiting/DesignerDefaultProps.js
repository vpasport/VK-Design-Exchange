class DesignerDefaultProps {

    constructor(id, vkId, raiting, firstName, lastName, photo){
        this._id = id;
        this._vkId = vkId;
        this._raiting = raiting;
        this._firstName = firstName;
        this._lastName = lastName;
        this._photo = photo;
    }

    getId(){ return this._id }
    getVkId(){ return this._vkId }
    getRaiting(){ return this._raiting }
    getFirstName(){ return this._firstName }
    getLastName(){ return this._lastName }
    getPhoto(){ return this._photo }

}

export default DesignerDefaultProps;