import DesignerDefaultProps from "./DesignerDefaultProps";

class DesignerCard extends DesignerDefaultProps {
    
    constructor(item){
        super(item.id, 
            item.vk_id, 
            item.rating, 
            item.first_name, 
            item.last_name, 
            item.photo, 
            item.engaged, 
            item.specializations,
            item.reviews_count
        );
    }

}

export default DesignerCard;