import React, { useEffect } from 'react';
import {
    Epic,
    SplitCol,
    SplitLayout,
    withAdaptivity,
    ViewWidth,
    PanelHeader,
} from '@vkontakte/vkui';
import { Icon24Gallery } from '@vkontakte/icons';
import { Icon24InfoCircleOutline } from '@vkontakte/icons';
import '@vkontakte/vkui/dist/vkui.css';

import DesctopSideBar from './components/DesctopSideBar';
import MobileSideBar from './components/MobileSideBar';

import GalleryView from './views/GalleryView';
import { sessionContext, viewContext } from './App';

const Panels = withAdaptivity(({ viewWidth }) => {

    const { isDesktop, setIsDesktop } = sessionContext();
    const { activeStory, setActiveStoryAndPanel } = viewContext();

    const params = [
        {
            story: 'gallery',
            name: 'Галерея',
            icon: <Icon24Gallery />,
            defaultPanel: 'gallery'
        },
        {
            story: 'table',
            name: 'О доске',
            icon: <Icon24InfoCircleOutline />,
            defaultPanel: 'table'
        }
    ]

    useEffect(() => {
        setIsDesktop(viewWidth >= ViewWidth.SMALL_TABLET)
    }, [])

    return (
        <SplitLayout
            header={!isDesktop && <PanelHeader separator={false} />}
            style={{ justifyContent: "center" }}
        >
            {isDesktop && (
                <DesctopSideBar
                    activeStory={activeStory}
                    onStoryChange={(story, panel) => setActiveStoryAndPanel(story, panel)}
                    isDesktop={isDesktop}
                    params={params}
                />
            )}
            <SplitCol
                animate={!isDesktop}
                spaced={isDesktop}
                width={isDesktop ? '560px' : '100%'}
                maxWidth={isDesktop ? '560px' : '100%'}
            >
                <Epic activeStory={activeStory} tabbar={!isDesktop &&
                    <MobileSideBar
                        activeStory={activeStory}
                        onStoryChange={(story, panel) => setActiveStoryAndPanel(story, panel)}
                        params={params}
                    />
                }>
                    <GalleryView id='gallery' />
                </Epic>
            </SplitCol>
        </SplitLayout>
    );
}, {
    viewWidth: true
});

<Panels />

export default Panels;