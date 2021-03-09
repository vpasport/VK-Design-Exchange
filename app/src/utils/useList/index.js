import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getActionsByType from './getActionsByType';

const useList = (load, from, to, loadLength, useAlert, type) => {

    const dispatch = useDispatch();
    const { changeList, changeLength, changeFromId, changeSecondLength } = useMemo(() => getActionsByType(type, dispatch), []);
    const { length, secondLength, fromId, list } = useSelector(state => state[type]);

    const [ isFetching, setIsFetching ] = useState(false);

    const changeHasMore = () => {
        //check by to
        let isHasMore = Boolean(secondLength < to || to === null);

        //check by list length
        isHasMore = Boolean(isHasMore && (!length || secondLength < length));

        //check by loadLength
        isHasMore = Boolean(isHasMore && loadLength !== null);
        if(to !== null)
            isHasMore = Boolean(isHasMore && loadLength < to);


        return isHasMore;
    }

    const hasMore = useMemo(() => changeHasMore(), [secondLength, length]);

    const loadList = async () => {
        console.log(secondLength, from)
        try{
            let nextStep;
            
            if(hasMore) nextStep = secondLength + loadLength;
            else if(loadLength === null || loadLength > to) nextStep = to;
            else nextStep = null;
            
            const data = await load(from, nextStep, fromId);

            changeList(data.list);

            if(!length) changeLength(data.count);
            if(!fromId) changeFromId(data.fromId);
            
            changeSecondLength(secondLength + loadLength);
        }
        catch(error){
            useAlert.error('Ошибка', error.message);
        }
    }

    const updateList = () => {
        changeLength(null);
        changeFromId(null);
        changeSecondLength(Number(from));

        setIsFetching(true);
    }


    useEffect(() => {

        const fetchData = async () => {
            await loadList();
            setIsFetching(false);
        }

        if(isFetching) fetchData()

    }, [isFetching])


    useEffect(() => {
        if(!list.length) loadList()
    }, []);


    return {
        bind: {
            list, length, secondLength, hasMore, isFetching
        },
        loadList, updateList
    }

}

export default useList;