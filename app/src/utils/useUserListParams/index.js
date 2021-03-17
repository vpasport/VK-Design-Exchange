import { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import getActionsByType from './getActionsByType';

const useUserListParams = (actionType) => {

    const { activeDesignerId, activeDesigner } = useSelector(state => state.designer);
    const { prevUserId } = useSelector(state => state[actionType]);
    const [ isShowList, setShowList ] = useState(activeDesigner.getId() === prevUserId);
    const { changeList, changePrevUserId } = getActionsByType(actionType)

    useEffect(() => {
        if(!isShowList){
            changeList(null);
            setShowList(true);
        }
    }, [])

    const checkId = () => {
        const condition = activeDesigner.getId() !== prevUserId;

        if (condition) changePrevUserId(activeDesigner.getId());

        return condition;
    }

    return {
        bind: { activeDesigner, isShowList },
        checkId
    }

}

export default useUserListParams;