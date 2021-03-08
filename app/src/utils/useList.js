import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { changeGallery, changeLength, changeFromId, changeSecondLength } from '../store/GalleryList/actions';

const useList = (list, changeList, load, from, to, loadLength, useAlert) => {

    const { length, secondLength, fromId } = useSelector(state => state.galleryList);
    const dispatch = useDispatch();

    // const [ length, setlength ] = useState(0);
    // const [ secondLength, setSecondLength ] = useState(Number(from));
    const [ isLoad, setIsLoad ] = useState(false);
    // const [ fromId, setFromId ] = useState(null);

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
        try{
            let nextStep;
            
            if(hasMore) nextStep = secondLength + loadLength;
            else if(loadLength === null || loadLength > to) nextStep = to;
            else nextStep = null;
            
            const data = await load(secondLength, nextStep, fromId);

            console.log(data)

            changeList([...list, ...data.list]);

            if(!length) dispatch(changeLength(data.count));
            dispatch(changeSecondLength(secondLength + loadLength));

            if(!isLoad) setIsLoad(true);
            if(!fromId) dispatch(changeFromId(data.fromId));
        }
        catch(error){
            useAlert.error('Ошибка', error.message);
        }
    }


    useEffect(() => {
        if(!list.length)
            loadList()
    }, []);


    return {
        bind: {
            list, length, secondLength, isLoad, hasMore
        },
        changeList, loadList
    }

}

export default useList;