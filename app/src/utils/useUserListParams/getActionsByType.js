import { useDispatch } from 'react-redux';
import * as portfolio from '../../store/Designer/Portfolio/actions'
import * as reviews from '../../store/Designer/Reviews/actions';

export default type => {

    const dispatch = useDispatch();

    const actions = {
        reviews,
        portfolio
    }

    return {
        changeList: list => dispatch(actions[type].changeList(list)),
        changePrevUserId: prevUserId => dispatch(actions[type].changePrevUserId(prevUserId))
    }

}