import DesignDefaultProps from './DesignDefaultProps';

const { REACT_APP_API_URL } = process.env;

class Design extends DesignDefaultProps {

    constructor(item){
        super(item.title, item.id);

        this._projectDescription = item.project_description;
        this._workImage = `${REACT_APP_API_URL}/${item.work_image}`;
        this._designerId = item.author?.id;
    }

    getProjectDescription(){ return this._projectDescription }
    getWorkImage(){ return this._workImage }
    getDesignerId() { return this._designerId }

}

export default Design;