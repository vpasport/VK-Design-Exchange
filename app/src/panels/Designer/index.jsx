import { Avatar, Button, Div, FixedLayout, Group, Panel, PanelHeader, PanelHeaderBack, PanelSpinner, SimpleCell, Text, Title } from '@vkontakte/vkui';
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { alertContext, sessionContext } from '../../App';
import { connect, useSelector } from 'react-redux';

import { changeActiveDesignerId, changeActiveDesigner } from '../../store/Designer/actions';
import { getDesignerInfoById, openVkLink } from '../../utils/helpers';
import { useRouter } from '@unexp/router';

import styles from './style.module.scss';
import StarRatings from '../../components/StarRatings';

import { Icon24Work } from '@vkontakte/icons';
import { Icon24Advertising } from '@vkontakte/icons';
import OutlineCellButtonBlock from '../../components/OutlineCellButtonBlock';
import OutlineCellButton from '../../components/OutlineCellButton';
import { Icon24ComputerOutline } from '@vkontakte/icons';
import { Icon24CommentOutline } from '@vkontakte/icons';

const Designer = ({ id, activeDesignerId, activeDesigner, changeActiveDesigner }) => {

    const { useAlert } = alertContext();
    const { push, back } = useRouter();
    const { fromMobile, isDesktop } = sessionContext();

    const isFetchDesigner = useMemo(() => Boolean(!activeDesigner || activeDesigner.getId() !== activeDesignerId), [activeDesigner]);


    useEffect(() => {

        const fetchData = async () => {
            try {
                const activeDesigner = await getDesignerInfoById(activeDesignerId);
                changeActiveDesigner(activeDesigner)
            }
            catch (error) {
                useAlert.show('Ошибка', error.message, [{
                    title: 'Назад',
                    autoclose: true,
                    action: () => push({ panel: 'raiting' })
                }])
            }
        }

        if (isFetchDesigner)
            fetchData();

    }, [])

    const openDesignerPage = () => {
        openVkLink(`https://vk.com/id${activeDesigner.getVkId()}`, fromMobile);
    }

    return (
        <Panel id={id} className={styles.panel}>
            <PanelHeader left={
                <PanelHeaderBack onClick={back} />}
            >
                Дизайнер
            </PanelHeader>
            {!isFetchDesigner ?
                <>
                    <Group>
                        <Div className={styles.userBlock}>
                            <Avatar src={activeDesigner.getPhoto()} className={styles.userBlock__photo} size={120} />
                            <div className={styles.userBlock__info}>
                                <Title weight='bold'>{`${activeDesigner.getFirstName()} ${activeDesigner.getLastName()}`}</Title>
                                <StarRatings rating={activeDesigner.getRating()} className={styles.userBlock__raiting} />
                                <Text className={`${styles.userBlock__status} ${!activeDesigner.getEngaged() && styles.userBlock__status_active}`}>
                                    {activeDesigner.getEngaged() ?
                                        `Занят до ${activeDesigner.getEngagedDate()}`
                                        :
                                        `Свободен`
                                    }
                                </Text>
                            </div>
                        </Div>
                    </Group>
                    {activeDesigner.hasSpecialisations && (
                        <Group>
                            <Div>
                                <Title level="3">Специализация:</Title>
                                <ul className={styles.specializationList}>
                                    {activeDesigner.specializations.map(({name, id}) => (
                                        <li className={styles.specializationItem}>
                                            <Button
                                                hasActive={false}
                                                hasHover={false}
                                                key={id}
                                            >
                                                {name}
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </Div>
                        </Group>
                    )}
                    <Group separator={!isDesktop && 'hide'}>
                        <Div className={styles.specialisation}>
                            <Title level='3'>Биография</Title>
                            <div
                                className={styles.specialisation__text}
                                dangerouslySetInnerHTML={{ __html: activeDesigner.getBio() || 'Нет данных' }}
                            />
                        </Div>
                    </Group>
                    <Group className={styles.bottom}>
                        <OutlineCellButtonBlock>
                            <OutlineCellButton
                                before={<Icon24ComputerOutline />}
                                onClick={() => push({ panel: 'portfolio' })}
                                indicator={activeDesigner.portfoliosCount}
                            >
                                Посмотреть портфолио
                            </OutlineCellButton>
                            <OutlineCellButton
                                before={<Icon24CommentOutline />}
                                onClick={() => push({ panel: 'reviews' })}
                                indicator={activeDesigner.reviewsCount}
                            >
                                Отзывы
                            </OutlineCellButton>
                        </OutlineCellButtonBlock>
                        {React.createElement(isDesktop ? 'div' : FixedLayout, isDesktop ? null : { filled: true, vertical: 'bottom' },
                            <Div>
                                {/* <Button
                                    stretched
                                    mode='outline'
                                    size='l'
                                    onClick={() => push({ panel: 'offers' })}
                                >
                                    Посмотреть услуги
                                </Button> */}
                                <Button
                                    stretched
                                    size='l'
                                    onClick={openDesignerPage}
                                >
                                    Связаться с дизайнером
                                </Button>
                            </Div>
                        )}
                    </Group>
                </>
                :
                <PanelSpinner size='large' />
            }

        </Panel>
    )
}

Designer.propTypes = {
    id: PropTypes.string.isRequired,
    activeDesignerId: PropTypes.number.isRequired
}

const mapStateToProps = (state) => {
    return {
        activeDesignerId: state.designer.activeDesignerId,
        activeDesigner: state.designer.activeDesigner
    }
}

const mapDispatchToProps = {
    changeActiveDesignerId,
    changeActiveDesigner
}

export default connect(mapStateToProps, mapDispatchToProps)(Designer);

//https://stage-app7779919-fcc86a31f9f8.pages.vk-apps.com/index.html