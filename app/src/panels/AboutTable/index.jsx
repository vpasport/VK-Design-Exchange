import React from 'react';
import PropTypes from 'prop-types';
import { Group, Panel, PanelHeader, Text, Div, Title, Button } from '@vkontakte/vkui';
import { Icon24PictureOutline } from '@vkontakte/icons';
import { Icon24UsersOutline } from '@vkontakte/icons';

import styles from './style.module.scss';
import {useRouter} from '@unexp/router';

const AboutTable = ({ id }) => {

    const {push} = useRouter();

    return (
        <Panel id={id}>
            <PanelHeader>Доска почета</PanelHeader>
            <Group>
                <Div>
                    <Title level='2' weight='bold' className={styles.header}>О приложении</Title>
                    <Text>
                        На доске почета размещены дизайнеры,
                        которые прошли мой авторский курс и получили за курсовую
                        работу не менее 5 баллов.<br /><br />
                        Работы, рейтинг и отзывы каждого дизайнера можно посмотреть
                        в его профиле.
                    </Text>
                    <Title level='2' weight='bold' className={styles.videoHeader}>Видео-инструкция</Title>
                    <div className={styles.videoContainer}>
                        <iframe
                            src="https://www.youtube.com/embed/1vCcjiZz_Bs"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            className={styles.videoContainer__video}>
                        </iframe>
                    </div>

                </Div>
            </Group>
            <Group>
                <Div>
                    <Button
                        stretched
                        size='l'
                        before={<Icon24UsersOutline />}
                        onClick={() => push({view: 'raiting', panel: 'raiting'})}
                    >
                        Исполнители
                    </Button>
                    <Button
                        stretched
                        size='l'
                        className={styles.button}
                        before={<Icon24PictureOutline />}
                        onClick={() => push({view: 'gallery', panel: 'gallery'})}
                        mode='outline'
                    >
                        Галерея работ
                    </Button>
                </Div>
            </Group>
        </Panel>
    )
}

AboutTable.propTypes = {
    id: PropTypes.string.isRequired
}

export default AboutTable;