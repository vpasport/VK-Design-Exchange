import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changePrevUserId } from '../../store/Designer/DesignerListBlock/actions';
import { changeList } from '../../store/ListBlock/actions';

const useUserListParams = (actionType) => {

    const { activeDesignerId, activeDesigner } = useSelector(state => state.designer);
    const { prevUserId } = useSelector(state => state[actionType]);
    const [ isShowList, setShowList ] = useState(activeDesigner.getId() === prevUserId);
    const dispatch = useDispatch();

    const dispatchActionType = useMemo(() => actionType.toUpperCase(), []);

    useEffect(() => {
        if(!isShowList){
            dispatch(changeList(dispatchActionType)(null));
            setShowList(true);
        }
    }, [])

    const checkId = () => {
        const condition = activeDesigner.getId() !== prevUserId;

        if (condition) dispatch(changePrevUserId(dispatchActionType)(activeDesigner.getId()));

        return condition;
    }

    return {
        bind: { activeDesigner, isShowList },
        checkId
    }

}

export default useUserListParams;