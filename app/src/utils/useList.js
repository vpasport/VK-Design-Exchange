import { useState, useEffect, useMemo } from 'react';

const useList = (load, from, to, loadLength, useAlert) => {

    const [ list, setList ] = useState([]);
    const [ listLength, setListLength ] = useState(0);
    const [ secondLength, setSecondLength ] = useState(Number(from));
    const [ isLoad, setIsLoad ] = useState(false);

    const changeHasMore = () => {
        //check by to
        let isHasMore = Boolean(secondLength < to || to === null);

        //check by list length
        isHasMore = Boolean(isHasMore && (!listLength || secondLength < listLength));

        //check by loadLength
        isHasMore = Boolean(isHasMore && loadLength !== null);
        if(to !== null)
            isHasMore = isHasMore && loadLength < to;


        return isHasMore;
    }

    const hasMore = useMemo(() => changeHasMore(), [secondLength, listLength]);

    const loadList = async () => {
        try{
            let nextStep;
            
            if(hasMore) nextStep = secondLength + loadLength;
            else if(loadLength === null || loadLength > to) nextStep = to;
            else nextStep = null;
            
            const data = await load(secondLength, nextStep);

            setList(prev => [...prev, ...data.list]);

            if(!listLength) setListLength(data.count);
            setSecondLength(prev => prev + loadLength);

            if(!isLoad) setIsLoad(true);
        }
        catch(error){
            useAlert.error('Ошибка', error.message);
        }
    }


    useEffect(() => {
        loadList()
    }, []);


    return {
        bind: {
            list, listLength, secondLength, isLoad, hasMore
        },
        setList, setListLength, setSecondLength, loadList
    }

}

export default useList;