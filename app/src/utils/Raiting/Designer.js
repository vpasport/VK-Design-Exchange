import DesignerDefaultProps from "./DesignerDefaultProps";

class Designer extends DesignerDefaultProps {

    constructor(item){
        super(item.id, item.vk_id, item.raiting, item.first_name, item.last_name, item.photo);

        this._experience = item.experience;
        this._specialisation = item.specialisation;
    }

    getExperience(){ return this._experience }
    getSpecialisation(){ return this._specialisation }

}

export default Designer;