import { useRouter } from '@unexp/router';
import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { alertContext } from '../../App';
import { changeActiveDesigner } from '../../store/Designer/actions';
import { changePrevUserId } from '../../store/Designer/DesignerListBlock/actions';
import { changeList } from '../../store/ListBlock/actions';
import { getDesignerInfoById } from '../helpers';

const useUserListParams = (actionType) => {

    const { activeDesignerId, activeDesigner } = useSelector(state => state.designer);
    const { prevUserId } = useSelector(state => state[actionType]);
    const [isShowList, setShowList] = useState(Boolean(activeDesigner && activeDesigner.getId() === prevUserId));
    const dispatch = useDispatch();
    const { useAlert } = alertContext();
    const {back} = useRouter();

    const dispatchActionType = useMemo(() => actionType.toUpperCase(), []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const activeDesigner = await getDesignerInfoById(activeDesignerId);
                dispatch(changeActiveDesigner(activeDesigner));
            }
            catch(error){
                useAlert.show('Ошибка', error.message, [{
                    title: 'Назад',
                    autoclose: true,
                    action: back
                }])
            }
        }

        if (!activeDesigner) fetchData();
        else if (!isShowList) {
            dispatch(changeList(dispatchActionType)([]));
            setShowList(true);
        }

    }, [activeDesigner])

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