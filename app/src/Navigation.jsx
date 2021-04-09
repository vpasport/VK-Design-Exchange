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
import { Icon24Gallery } from '@vkontakte/icons';
import { Icon24InfoCircleOutline } from '@vkontakte/icons';
import { Icon16StarCircle } from '@vkontakte/icons';
import { Icon24Market } from '@vkontakte/icons';
//import '@vkontakte/vkui/dist/vkui.css';

import DesctopSideBar from './components/DesctopSideBar';
import MobileSideBar from './components/MobileSideBar';

import GalleryView from './views/GalleryView';
import AboutTableView from './views/AboutTableView';
import { sessionContext } from './App';
import RaitingView from './views/RaitingView';
import useRouter from './utils/useRouter';
import OrdersView from './views/OrdersView';
import { Icon24Users } from '@vkontakte/icons';

const Panels = withAdaptivity(({ viewWidth }) => {

    const { isDesktop, setIsDesktop } = sessionContext();
    const platform = usePlatform();
    const hasHeader = useMemo(() => platform !== VKCOM, []);
    
    const router = useRouter();

    const params = [
        {
            story: 'table',
            name: 'О доске',
            icon: <Icon24InfoCircleOutline />,
            defaultPanel: 'table'
        },
        {
            story: 'gallery',
            name: 'Галерея',
            icon: <Icon24Gallery />,
            defaultPanel: 'gallery'
        },
        {
            story: 'raiting',
            name: 'Рейтинг',
            icon: <Icon24Users />,
            defaultPanel: 'raiting'
        },
        {
            story: 'orders',
            name: 'Заказы',
            icon: <Icon24Market />,
            defaultPanel: 'orders'
        }
    ]

    useEffect(() => {
        setIsDesktop(viewWidth >= ViewWidth.SMALL_TABLET)
    }, [])

    return (
        <AppRoot>
            <SplitLayout
                header={hasHeader && <PanelHeader separator={false} />}
                style={{ justifyContent: "center" }}
            >
                {isDesktop && (
                    <DesctopSideBar
                        activeStory={router.bind.activeStory}
                        onStoryChange={(story, panel) => router.setActiveStoryAndPanel(story, panel)}
                        isDesktop={isDesktop}
                        params={params}
                        hasHeader={hasHeader}
                    />
                )}
                <SplitCol
                    animate={!isDesktop}
                    spaced={isDesktop}
                    width={isDesktop ? '560px' : '100%'}
                    maxWidth={isDesktop ? '560px' : '100%'}
                >
                    <Epic activeStory={router.bind.activeStory} tabbar={!isDesktop &&
                        <MobileSideBar
                            activeStory={router.bind.activeStory}
                            onStoryChange={(story, panel) => router.setActiveStoryAndPanel(story, panel)}
                            params={params}
                        />
                    }>
                        <GalleryView id='gallery' />
                        <AboutTableView id='table' />
                        <RaitingView id='raiting' />
                        <OrdersView id='orders' />
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