import axios from 'axios';
import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as listActions from '../../store/ListBlock/actions';

const useList = (loadList, loadFilters, from, to, loadLength, useAlert, type, loadingCondition = () => {}) => {

    const dispatch = useDispatch();
    const { length, secondLength, fromId, list, filters, activeFilters, listFormat, isFetch, posibleListFormats } = useSelector(state => state[type]);

    const [ isLoad, setIsLoad ] = useState(Boolean(list && list.length));
    const [ elemOffsetForListFormat, setElemOffsetForListFormat ] = useState(null);
    const dispatchActionType = useMemo(() => type.toUpperCase(), []);

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
            let nextStep = null;
            
            if(hasMore) nextStep = secondLength + loadLength;
            else if(loadLength === null || loadLength > to) nextStep = to;
            
            const data = await loadList({from, to: nextStep || 'all', fromId, activeFilters});

            dispatch(listActions.changeList(dispatchActionType)(data.list));

            if(!length) dispatch(listActions.changeLength(dispatchActionType)(data.count));
            if(!fromId) dispatch(listActions.changeFromId(dispatchActionType)(data.fromId));
            
            dispatch(listActions.changeSecondLength(dispatchActionType)(secondLength + loadLength));
            setIsLoad(true)
        }
        catch(error){
            useAlert.error('Ошибка', error.message);
        }
    }

    const getFilters = async () => {
        try{
            const data = await loadFilters();
            dispatch(listActions.changeFilters(dispatchActionType)(data))
        }
        catch(error){
            useAlert.error('Ошибка', error.message);
        }
    }

    const updateList = () => dispatch(listActions.updateList(dispatchActionType)());
    const changeListFormat = (listFormat, firstElem) => {
        setElemOffsetForListFormat(firstElem)
        dispatch(listActions.changeListFormat(dispatchActionType)(listFormat));
    }

    useEffect(() => {
        if(elemOffsetForListFormat)
            window.scrollTo({top: elemOffsetForListFormat.getBoundingClientRect().top + pageYOffset - 110})
    }, [listFormat])

    useEffect(() => {

        const fetchData = async () => {
            await getList();
            dispatch(listActions.changeIsFetch(dispatchActionType)(false))
        }

        if(isFetch) fetchData()

    }, [isFetch])


    useEffect(() => {
        if(!filters.length && loadFilters) getFilters();
        if( loadingCondition() || !list?.length){
            dispatch(listActions.changeList(dispatchActionType)([]));
            getList();
        }
        else {
            setIsLoad(true)
        };
    }, []);


    return {
        bind: {
            list, length, secondLength, hasMore, isFetch, filters, activeFilters, listFormat, isLoad, posibleListFormats
        },
        getList, updateList, changeListFormat
    }

}

export default useList;