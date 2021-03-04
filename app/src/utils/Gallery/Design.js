import DesignDefaultProps from './DesignDefaultProps';

const { REACT_APP_API_URL } = process.env;

class Design extends DesignDefaultProps {

    constructor(item){
        super(item.title, item.description, item.id);

        this._projectDescription = item.project_description;
        this._taskDescription = item.task_description;
        this._completedWork = item.completed_work;
        this._workImage = `${REACT_APP_API_URL}/${item.work_image}`;
    }

    getProjectDescription(){ return this._projectDescription }
    getTaskDescription(){ return this._taskDescription }
    getCompletedWork(){ return this._completedWork }
    getWorkImage(){ return this._workImage }

}

export default Design;