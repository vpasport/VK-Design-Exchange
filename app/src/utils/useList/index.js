import axios from 'axios';
import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getActionsByType from './getActionsByType';

const useList = (loadList, loadFilters, from, to, loadLength, useAlert, type ) => {

    const dispatch = useDispatch();

    const { changeList, 
            changeLength, 
            changeFromId, 
            changeSecondLength, 
            changeFilters, 
            changeActiveFilters
        } = useMemo(() => getActionsByType(type, dispatch), []);

    const { length, secondLength, fromId, list, filters, activeFilters } = useSelector(state => state[type]);

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

    const getList = async () => {
        try{
            let nextStep;
            
            if(hasMore) nextStep = secondLength + loadLength;
            else if(loadLength === null || loadLength > to) nextStep = to;
            else nextStep = null;
            
            const data = await loadList(from, nextStep, fromId, activeFilters);

            changeList(data.list);

            if(!length) changeLength(data.count);
            if(!fromId) changeFromId(data.fromId);
            
            changeSecondLength(secondLength + loadLength);
        }
        catch(error){
            useAlert.error('Ошибка', error.message);
        }
    }

    const getFilters = async () => {
        try{
            const data = await loadFilters();
            changeFilters(data.tags);
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
    // useEffect(() => {
    //     console.log(filters)
    // }, [filters])


    useEffect(() => {

        const fetchData = async () => {
            await getList();
            setIsFetching(false);
        }

        if(isFetching) fetchData()

    }, [isFetching])


    useEffect(() => {
        if(!filters.length) getFilters();
        if(!list.length) getList();
    }, []);


    return {
        bind: {
            list, length, secondLength, hasMore, isFetching, filters, activeFilters
        },
        getList, updateList, changeActiveFilter
    }

}

export default useList;