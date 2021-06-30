class DesignerDefaultProps {

    constructor(id, vkId, rating, firstName, lastName, photo, engaged, specializations, reviewsCount){
        this._id = id;
        this._vkId = vkId;
        this._rating = Number(rating);
        this._firstName = firstName;
        this._lastName = lastName;
        this._photo = photo;
        this._engaged = engaged;
        this._specializations = specializations;
        this._reviewsCount = reviewsCount;
    }

    getId(){ return this._id }
    getVkId(){ return this._vkId }
    getRating(){ return this._rating }
    getFirstName(){ return this._firstName }
    getLastName(){ return this._lastName }
    getPhoto(){ return this._photo }

    get fullName(){ return `${this.getFirstName()} ${this.getLastName()}` }
    get engaged(){ return this._engaged }
    get reviewsCount(){ return this._reviewsCount }

    get hasSpecialisations(){ return Boolean(this._specializations?.length) }
    get specializationNames(){ return this._specializations?.map(el => el.name) }
    get specializations(){ return this._specializations }
    get specializationsToString(){ return this.specializationNames?.join(', ') }
}

export default DesignerDefaultProps;