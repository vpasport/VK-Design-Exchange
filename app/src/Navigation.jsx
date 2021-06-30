import React, { useEffect, useMemo } from 'react';
import {
    Epic,
    SplitCol,
    SplitLayout,
    withAdaptivity,
    ViewWidth,
    PanelHeader,
    AppRoot,
    usePlatform,
    VKCOM,
} from '@vkontakte/vkui';
import { Icon24PictureOutline } from '@vkontakte/icons';
import { Icon24HomeOutline } from '@vkontakte/icons';
import { Icon16StarCircle } from '@vkontakte/icons';
import { Icon24Market } from '@vkontakte/icons';
import { Icon24GearOutline } from '@vkontakte/icons';
import { Icon24UsersOutline } from '@vkontakte/icons';
//import '@vkontakte/vkui/dist/vkui.css';

import DesctopSideBar from './components/DesctopSideBar';
import MobileSideBar from './components/MobileSideBar';

import GalleryView from './views/GalleryView';
import AboutTableView from './views/AboutTableView';
import { sessionContext } from './App';
import RaitingView from './views/RaitingView';
import {useRouter} from '@unexp/router';
import OrdersView from './views/OrdersView';
import { Icon24Users } from '@vkontakte/icons';
import { useDispatch } from 'react-redux';
import { store } from '.';
import { changeActiveDesignId } from './store/Design/actions';
import {useStructure, useLocation, useHistory, useParams } from '@unexp/router';

const Panels = withAdaptivity(({ viewWidth }) => {

    const hash = useMemo(() => window.location.hash, []);

    const { isDesktop, setIsDesktop } = sessionContext();
    const dispatch = useDispatch();
    const history = useHistory();

    const {push} = useRouter();

    const structure = useStructure({view: 'table', panel: 'table'});
    const location = useLocation();

    const params = [
        {
            story: 'table',
            name: 'О доске',
            icon: <Icon24HomeOutline />,
            defaultPanel: 'table'
        },
        {
            story: 'gallery',
            name: 'Галерея',
            icon: <Icon24PictureOutline />,
            defaultPanel: 'gallery'
        },
        {
            story: 'raiting',
            name: 'Исполнители',
            icon: <Icon24UsersOutline />,
            defaultPanel: 'raiting'
        },
        {
            story: 'orders',
            name: 'Настройки',
            icon: <Icon24GearOutline />,
            defaultPanel: 'user'
        }
    ]

    useEffect(() => {
        if (hash) {
            const [key, value] = hash.split('=');
            switch (key) {
                case '#designId': {
                    dispatch(changeActiveDesignId(Number(value)));
                    push({view: 'gallery', panel: 'design'});
                    break;
                }
            }
        }

        setIsDesktop(viewWidth >= ViewWidth.SMALL_TABLET);
    }, []);

    const changeStory = (view, panel) => {

        //const lastPanelByView = history.some(el => el.view === view)

        if (location.view === view && location.panel === panel)
            window.scrollTo({ top: 0, behavior: 'smooth' });
        else 
            push({view, panel});
    }

    return (
        <AppRoot>
            <SplitLayout
                header={!isDesktop && <PanelHeader separator={false} />}
                style={{ justifyContent: "center", paddingTop: isDesktop && 20 }}
            >
                {isDesktop && (
                    <DesctopSideBar
                        activeStory={structure.view}
                        onStoryChange={changeStory}
                        isDesktop={isDesktop}
                        params={params}
                        hasHeader={!isDesktop}
                    />
                )}
                <SplitCol
                    animate={!isDesktop}
                    spaced={isDesktop}
                    width={isDesktop ? '560px' : '100%'}
                    maxWidth={isDesktop ? '560px' : '100%'}
                >
                    <Epic activeStory={structure.view}
                        tabbar={!isDesktop &&
                            <MobileSideBar
                                activeStory={structure.view}
                                onStoryChange={changeStory}
                                params={params}
                            />
                        }>
                        <GalleryView id='gallery' activePanel={structure.panel}/>
                        <AboutTableView id='table' activePanel={structure.panel}/>
                        <RaitingView id='raiting' activePanel={structure.panel}/>
                        <OrdersView id='orders' activePanel={structure.panel}/>
                    </Epic>
                </SplitCol>
            </SplitLayout>
        </AppRoot>
    );
}, {
    viewWidth: true
});

<Panels />

export default Panels;