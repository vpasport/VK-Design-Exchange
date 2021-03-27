import axios from 'axios';
import DesignerDefaultProps from "./DesignerDefaultProps";
import Designer from '.';

const { REACT_APP_API_URL } = process.env;

class DesignerCard extends DesignerDefaultProps {
    
    constructor(item){
        super(item.id, item.vk_id, item.rating, item.first_name, item.last_name, item.photo);
    }

}

export default DesignerCard;