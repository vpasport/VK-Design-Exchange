import { store } from '../../..';
import { changeActiveDesign } from '../../../store/Design/actions';
import DesignDefaultProps from './DesignDefaultProps';
import axios from 'axios';

const { REACT_APP_API_URL } = process.env;

class Design extends DesignDefaultProps {

    constructor(item) {
        super(item.title, item.id);

        console.log(item)

        this._projectDescription = item.project_description;
        this._workImage = `${REACT_APP_API_URL}/${item.work_image}`;
        this._designerId = item.author?.id;
        this._viewCount = item.views;
        this._likes = item.likes.count;
        this._isLikeChecked = item.likes.from_user;
        this._author = item.author;
    }

    getProjectDescription() { return this._projectDescription }
    getWorkImage() { return this._workImage }
    getDesignerId() { return this._designerId }

    get author(){ return this._author }

    set viewCount(value) {
        this.viewCount = value;
    }

    get viewCount() { return this._viewCount }
    get likes() { return this._likes }
    get isLikeChecked() { return this._isLikeChecked }

    updateDesign() {
        store.dispatch(changeActiveDesign(Object.assign(Object.create(Object.getPrototypeOf(this)), this)));
    }

    async setNewViewCounts() {
        const { data } = await axios.get(`portfolio/work/${this.getId()}/views`);

        if (!data.isSuccess) throw new Error();

        this._viewCount = data.work.views;
        this.updateDesign()
    }

    async changeLike() {
        const { user: { activeUser } } = store.getState();

        if(this._isLikeChecked){
            this._isLikeChecked = false;
            this._likes--;
        }
        else{
            this._isLikeChecked = true;
            this._likes++;
        }

        this.updateDesign();

        const { data } = await axios.post(`/portfolio/work/${this.getId()}/likes`, {
            url_params: activeUser.getVkUrlParams(),
            vk_id: activeUser.getId()
        })

        if (!data.isSuccess)
            this._isLikeChecked = !this._isLikeChecked;
        else
            this._likes = data.likes.count;

        this.updateDesign()
    }

}

export default Design;