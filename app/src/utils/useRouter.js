import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeRouterPath } from '../store/router/actions';

const useRouter = () => {

    const { path } = useSelector(state => state.path);
    const dispatch = useDispatch();

    const activeStory = useMemo(() => path[path.length - 1][0], [path]);
    const activePanel = useMemo(() => path[path.length - 1][1], [path]);

    const back = () => {
        const newPath = [...path];
        newPath.pop();
        dispatch(changeRouterPath(newPath))
    }

    const setActivePanel = (panel) => {
        const lastStory = path[path.length - 1][0];
        const newPath = [...path];
        newPath.push([lastStory, panel]);
        dispatch(changeRouterPath(newPath));
    }

    const setActiveStoryAndPanel = (story, panel) => {
        const newPath = [...path];
        newPath.push([story, panel]);
        dispatch(changeRouterPath(newPath));
    }

    const getPrevRoute = () => {
        return {
            panel: path[path.length - 2] ? path[path.length - 2][1] : path[path.length - 1][1],
            story: path[path.length - 2] ? path[path.length - 2][0] : path[path.length - 1][0],
        }
    }

    return {
        bind: { activePanel, activeStory },
        back, setActivePanel, setActiveStoryAndPanel, getPrevRoute
    }

}

export default useRouter;