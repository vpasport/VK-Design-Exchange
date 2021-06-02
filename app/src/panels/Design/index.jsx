import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Group, Panel, PanelHeader, PanelHeaderBack, PanelSpinner, Title, Div, Button, Cell, RichCell, Avatar, usePlatform, ANDROID, IOS, Text, Subhead, Caption } from '@vkontakte/vkui';
import bridge from '@vkontakte/vk-bridge';

import styles from './style.module.scss';
import { alertContext, sessionContext } from '../../App';
import { getDesignInfoById, openVkLink, parseDateFromServer } from '../../utils/helpers';
import { connect, useDispatch } from 'react-redux';
import { changeActiveDesign } from '../../store/Design/actions';
import { changeActiveDesignerId } from '../../store/Designer/actions';
import ViewsCounter from '../../components/ViewsCounter';
import LikeButton from '../../components/LikeButton';
import Comments from './Comments';
import StarRatings from '../../components/StarRatings';
import ShareButton from '../../components/ShareButton';
import { useRouter } from '@unexp/router';
import FavoriteButton from '../../components/FavoriteButton';

const Design = ({ id, activeDesignId, activeDesign, changeActiveDesignerId, changeActiveDesign }) => {

    const { useAlert } = alertContext();
    const { push, back } = useRouter();
    const { fromMobile } = sessionContext();
    const dispatch = useDispatch();

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
                    action: () => push({ panel: 'gallery' })
                }])
            }
        }

        const getViews = async () => {
            try {
                await activeDesign.setNewViewCounts();
            }
            catch (e) { }
        }

        if (isFetchDesign)
            fetchData();
        else
            getViews();

    }, [])

    useEffect(() => {
        if(!isFetchDesign){
            activeDesign.checkIsViewed();
        }
    }, [activeDesign])

    const changeAuthor = () => {
        changeActiveDesignerId(activeDesign.getDesignerId());
        push({ view: 'raiting', panel: 'designer' });
    }

    const showImage = (index) => {
        bridge.send("VKWebAppShowImages", {
            images: activeDesign.workImages,
            start_index: index
        })
    }

    const handleLikeClick = async () => {
        await activeDesign.changeLike()
    }

    const handleFavoriteClick = async () => {
        await activeDesign.changeIsFavorite();
    }

    const handleUserPage = () => {
        openVkLink(`https://vk.com/id${activeDesign.author.vk_id}`, fromMobile)
    }

    const handleDesignerPortfolio = () => {
        dispatch(changeActiveDesignerId(activeDesign.author.id));
        push({view: 'raiting', panel: 'portfolio'})
    }

    return (
        <Panel id={id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={back} />}
            >
                Карточка сайта
            </PanelHeader>
            {!isFetchDesign ?
                <>
                    <Group>
                        {activeDesign.author &&
                            <Cell
                                description={
                                    <StarRatings rating={activeDesign.author.rating} />
                                }
                                before={
                                    <Avatar src={activeDesign.author.photo} />
                                }
                                onClick={changeAuthor}
                            >
                                {`${activeDesign.author.first_name} ${activeDesign.author.last_name}`}
                            </Cell>
                        }
                        <Div className={styles.cardBlock}>
                            <Title level='1'>{activeDesign.getTitle()}</Title>

                            {activeDesign.getProjectDescription() &&
                                <div
                                    dangerouslySetInnerHTML={{ __html: activeDesign.getProjectDescription() }}
                                    className={styles.descriptionBlock}
                                />
                            }

                            <div className={styles.cardBlock__group_image}>
                                <Title level='1' className={styles.imageTitle}>Дизайн</Title>
                                {activeDesign.workImages.map((image, i) => (
                                    <img
                                        src={image}
                                        alt={`image ${i + 1}`}
                                        key={i}
                                        onClick={() => showImage(i)}
                                    />
                                ))}
                            </div>
                            <Button
                                mode='outline'
                                stretched
                                size='l'
                                className={styles.cardBlock__button}
                                onClick={handleUserPage}
                            >
                                Связаться с исполнителем
                            </Button>
                            <Button
                                mode='outline'
                                stretched
                                size='l'
                                className={styles.cardBlock__button}
                                onClick={handleDesignerPortfolio}
                            >
                                Другие работы автора
                            </Button>
                            {activeDesign.isForSale &&
                                <Button
                                    mode='outline'
                                    stretched
                                    size='l'
                                    className={styles.cardBlock__button}
                                    onClick={handleUserPage}
                                >
                                    Купить дизайн
                                </Button>
                            }

                            <div className={styles.cardBlock__footer}>
                                <div className={styles.footer__left}>
                                    <LikeButton
                                        isChecked={activeDesign.isLikeChecked}
                                        count={activeDesign.likes}
                                        onClick={handleLikeClick}
                                    />
                                    <ShareButton
                                        hash={`#designId=${activeDesignId}`}
                                        style={{ marginLeft: 18 }}
                                    />
                                    <FavoriteButton
                                        isChecked={activeDesign.isFavoriteChecked}
                                        style={{ marginLeft: 18 }}
                                        onClick={handleFavoriteClick}
                                    />
                                </div>
                                <ViewsCounter count={activeDesign.viewCount} />
                            </div>
                            {activeDesign.createDate &&
                                <Caption level='1' weight='regular' className={styles.date}>Опубликовано: {activeDesign.createDate}</Caption>
                            }
                        </Div>
                    </Group>
                    <Comments id={activeDesignId} />
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