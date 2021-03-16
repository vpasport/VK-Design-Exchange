import axios from 'axios';
import DesignerDefaultProps from "./DesignerDefaultProps";
import Designer from './Designer';

const { REACT_APP_API_URL } = process.env;

class DesignerCard extends DesignerDefaultProps {
    
    constructor(item){
        super(item.id, item.vk_id, item.raiting, item.first_name, item.last_name, item.photo);
    }

    async getDesignerInfo(){
        const { data } = await axios.get(`${REACT_APP_API_URL}/designers/${this.getId()}`);

        if(data.isSuccess){
            return new Designer(data.designer);
        }
        else throw new Error('Не удалось получать данные дизайнера')
    }

}

export default DesignerCard;