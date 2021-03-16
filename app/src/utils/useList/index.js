import axios from 'axios';
import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getActionsByType from './getActionsByType';

const useList = (loadList, loadFilters, from, to, loadLength, useAlert, type, loadingCondition = () => {}) => {

    const dispatch = useDispatch();

    const { changeList, 
            changeLength, 
            changeFromId, 
            changeSecondLength, 
            changeFilters, 
            changeActiveFilters,
            changeListFormat
        } = useMemo(() => getActionsByType(type, dispatch), []);

    const { length, secondLength, fromId, list, filters, activeFilters, listFormat } = useSelector(state => state[type]);

    const [ isFetching, setIsFetching ] = useState(false);
    const [ isLoad, setIsLoad ] = useState(Boolean(list && list.length));

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

    const getList = async () => {
        try{
            let nextStep;
            
            if(hasMore) nextStep = secondLength + loadLength;
            else if(loadLength === null || loadLength > to) nextStep = to;
            else nextStep = null;
            
            const data = await loadList({from, to: nextStep, fromId, activeFilters});

            changeList(data.list);

            if(!length) changeLength(data.count);
            if(!fromId) changeFromId(data.fromId);
            
            changeSecondLength(secondLength + loadLength);
            setIsLoad(true)
        }
        catch(error){
            useAlert.error('Ошибка', error.message);
        }
    }

    const getFilters = async () => {
        try{
            const data = await loadFilters();
            changeFilters(data);
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

    const changeActiveFilter = (filter) => {
        changeActiveFilters(filter);
        updateList();
    }


    useEffect(() => {

        const fetchData = async () => {
            await getList();
            setIsFetching(false);
        }

        if(isFetching) fetchData()

    }, [isFetching])


    useEffect(() => {
        if(!filters.length && loadFilters) getFilters();
        if( loadingCondition() || !list.length) getList();
        else setIsLoad(true);
    }, []);


    return {
        bind: {
            list, length, secondLength, hasMore, isFetching, filters, activeFilters, listFormat, isLoad
        },
        getList, updateList, changeActiveFilter, changeListFormat
    }

}

export default useList;