import { store } from '../../..';
import { changeActiveDesign } from '../../../store/Design/actions';
import DesignDefaultProps from './DesignDefaultProps';
import axios from 'axios';
import DesignCard from './DesignCard';
import { changeLength, changeList, changeSecondLength } from '../../../store/ListBlock/actions';
import { getApiLink, parseDateFromServer, parseDatetoString } from '../../helpers';
class Design extends DesignDefaultProps {

    constructor(item) {
        super(item.title, item.id, item.preview);

        this._projectDescription = item.project_description;
        this._workImages = item.images.map(image => `${getApiLink(true)}/${image.path}`);
        this._designerId = item.author?.id;
        this._viewCount = item.views;
        this._likes = item.likes.count;
        this._isLikeChecked = item.likes.from_user;
        this._author = item.author;
        this._isForSale = item.is_for_sale;
        this._isFavoriteChecked = item.in_favorites;
        this._createDate = item.create_date;
        this._isViewed = item.viewed;
        this._preview = item.preview;
    }

    getProjectDescription() { return this._projectDescription?.trim() }
    getWorkImage() { return this._workImage }
    getDesignerId() { return this._designerId }

    set viewCount(value) {this.viewCount = value;}

    get viewCount() { return this._viewCount }
    get likes() { return this._likes }
    get isLikeChecked() { return this._isLikeChecked }
    get author(){ return this._author }
    get workImages(){ return this._workImages }
    get isForSale(){ return this._isForSale }
    get isFavoriteChecked() { return this._isFavoriteChecked }
    get createDate(){
        if(!this._createDate) return this._createDate;
        else {
            const date = parseDateFromServer(this._createDate);
            return parseDatetoString(date, {day: 'numeric', month: 'long', year: 'numeric'});
        }
    }
    get isViewed() { return this._isViewed}
    get preview(){return this._preview}
    get isEmptyDescription(){return !Boolean(this.getProjectDescription().replace( /(<([^>]+)>)/ig, '').trim())}

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

    async changeIsFavorite(){
        let {user: {activeUser}, favoritesList: {list, fromId, length}} = store.getState();
        this._isFavoriteChecked = !this._isFavoriteChecked;

        const { status } = await axios.post(`/favorites`, {
            url_params: activeUser.getVkUrlParams(),
            portfolio_id: this.getId()
        })

        if(status !== 204){
            this._isFavoriteChecked = !this._isFavoriteChecked;
            this.updateDesign();
            return;
        }

        this.updateDesign();
        
        const findedFavorite = list.findIndex(el => el.getId() === this.getId());

        if(!fromId) return;

        if(findedFavorite === -1){
            list.unshift(new DesignCard({
                title: this.getTitle(),
                preview: this.preview,
                id: this.getId()
            }))
            length++;
        }
        else{
            list.splice(findedFavorite, 1);
            length--;
        }
        
        store.dispatch(changeList('FAVORITESLIST')([...list]))
        store.dispatch(changeLength('FAVORITESLIST')(length))
    }

    checkIsViewed(){
        let {viewedsList: {list, length, fromId}} = store.getState();

        if(!fromId) return;

        let _list = [...list];

        if(!this.isViewed){
            _list = this.addDesignCard(_list);
            length++;

            store.dispatch(changeList('VIEWEDSLIST')(_list))
            store.dispatch(changeLength('VIEWEDSLIST')(length))

            return;
        }

        const findedItem = list.findIndex(el => el.getId() === this.getId());

        if(findedItem !== -1) _list.splice(findedItem, 1);
        _list = this.addDesignCard(_list);

        store.dispatch(changeList('VIEWEDSLIST')(_list));
    }

    addDesignCard(_list){
        _list.unshift(new DesignCard({
            title: this.getTitle(),
            preview: this.preview,
            id: this.getId()
        }))

        return _list;
    }

}

export default Design;