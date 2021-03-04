import DesignDefaultProps from './DesignDefaultProps';
import Design from './Design';

import axios from 'axios';

const { REACT_APP_API_URL } = process.env;

class DesignCard extends DesignDefaultProps {

    constructor(item) {
        super(item.title, item.description, item.id);

        this._preview = `${REACT_APP_API_URL}/${item.preview}`;
    }

    getPreview() { return this._preview }

    async getDesignInfo() {
        const { data } = await axios(`${REACT_APP_API_URL}/portfolio/work/${this.getId()}`);


        if (data.isSuccess)
            return new Design(data.work);
        else
            throw new Error('Ошибка при загрузке дизайна')

    }

}

export default DesignCard;