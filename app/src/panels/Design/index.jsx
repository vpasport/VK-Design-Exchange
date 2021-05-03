import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Group, Panel, PanelHeader, PanelHeaderBack, PanelSpinner, Title, Div, Button } from '@vkontakte/vkui';
import bridge from '@vkontakte/vk-bridge';

import Info from './Info';

import styles from './style.module.scss';
import { alertContext } from '../../App';
import { getDesignInfoById } from '../../utils/helpers';
import { connect } from 'react-redux';
import { changeActiveDesign } from '../../store/Design/actions';
import { changeActiveDesignerId } from '../../store/Designer/actions';
import useRouter from '../../utils/useRouter';
import ViewsCounter from '../../components/ViewsCounter';
import LikeButton from '../../components/LikeButton';
import Comments from './Comments';

const Design = ({ id, activeDesignId, activeDesign, changeActiveDesignerId, changeActiveDesign }) => {

    const { useAlert } = alertContext();
    const router = useRouter();

    const isFetchDesign = useMemo(() => Boolean(!activeDesign || activeDesign.getId() !== activeDesignId), [activeDesign]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const activeDesign = await getDesignInfoById(activeDesignId);
                changeActiveDesign(activeDesign);
            }
            catch (error) {
                useAlert.show('Ошибка', error.message, [{
                    title: 'Назад',
                    autoclose: true,
                    action: () => setActivePanel('gallery')
                }])
            }
        }

        const getViews = async () => {
            try {
                await activeDesign.setNewViewCounts();
            }
            catch (e) {
                console.log(e)
            }
        }

        if (isFetchDesign)
            fetchData();
        else
            getViews();

    }, [])

    const changeAuthor = () => {
        changeActiveDesignerId(activeDesign.getDesignerId());
        router.setActiveStoryAndPanel('raiting', 'designer');
    }

    const showImage = () => {
        bridge.send("VKWebAppShowImages", {
            images: [
                activeDesign.getWorkImage()
            ],
        })
    }

    const handleLikeClick = async () => {
        await activeDesign.changeLike()
    }


    return (
        <Panel id={id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={() => router.back()} />}
            >
                Карточка сайта
            </PanelHeader>
            {!isFetchDesign ?
                <>
                    <Group>
                        <Div className={styles.cardBlock}>
                            <Title level='1'>{activeDesign.getTitle()}</Title>
                            {/* <Info title='Проект заказчика:' text={activeDesign.getProjectDescription()} />
                        <Info title='Задача заказчика:' text={activeDesign.getTaskDescription()} />
                        <Info title='Что было сделано:' text={activeDesign.getCompletedWork()} /> */}

                            {activeDesign.getProjectDescription() &&
                                <div dangerouslySetInnerHTML={{ __html: activeDesign.getProjectDescription() }} />
                            }

                            <div className={styles.cardBlock__group_image}>
                                <Title level='1'>Дизайн</Title>
                                <img 
                                src={activeDesign.getWorkImage()} 
                                alt="test"
                                onClick={showImage}
                            />
                            </div>

                            {Boolean(activeDesign.getDesignerId() && router.getPrevRoute().panel !== 'portfolio') &&
                                <Button
                                    mode='outline'
                                    stretched
                                    size='l'
                                    className={styles.cardBlock__button}
                                    onClick={changeAuthor}
                                >
                                    В карточку автора
                            </Button>
                            }
                            <div className={styles.cardBlock__footer}>
                                <LikeButton
                                    isChecked={activeDesign.isLikeChecked}
                                    count={activeDesign.likes}
                                    onClick={handleLikeClick}
                                />
                                <ViewsCounter count={activeDesign.viewCount} />
                            </div>
                        </Div>
                    </Group>
                    <Comments id={activeDesignId}/>
                </>
                :
                <PanelSpinner size='large' />
            }

        </Panel>
    )
}

Design.propTypes = {
    id: PropTypes.string.isRequired,
    activeDesignId: PropTypes.number.isRequired
}

const mapStateToProps = (state) => {
    return {
        activeDesignId: state.design.activeDesignId,
        activeDesign: state.design.activeDesign
    }
}

const mapDispatchToProps = {
    changeActiveDesignerId,
    changeActiveDesign
}

export default connect(mapStateToProps, mapDispatchToProps)(Design);