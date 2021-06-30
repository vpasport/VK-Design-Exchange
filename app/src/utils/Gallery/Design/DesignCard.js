import { getApiLink } from '../../helpers';
import DesignDefaultProps from './DesignDefaultProps';

class DesignCard extends DesignDefaultProps {

    constructor(item) {
        super(item.title, item.id);

        this._preview = `${getApiLink(true)}/${item.preview}`;
    }

    getPreview() { return this._preview }

}

export default DesignCard;