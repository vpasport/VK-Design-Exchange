import React from 'react';
import PropTypes from 'prop-types';
import { Group, Panel, PanelHeader, Text, Div, Title, Button } from '@vkontakte/vkui';
import { Icon24Gallery } from '@vkontakte/icons';
import { Icon16StarCircle } from '@vkontakte/icons';

import styles from './style.module.scss';
import {useRouter} from '@unexp/router';

const AboutTable = ({ id }) => {

    const {push} = useRouter();

    return (
        <Panel id={id}>
            <PanelHeader>Доска почета</PanelHeader>
            <Group>
                <Div>
                    <Text>
                        На доске почета размещены дизайнеры,
                        которые прошли мой авторский курс и получили за курсовую
                        работу не менее 5 баллов.<br /><br />
                        Работы, рейтинг и отзывы каждого дизайнера можно посмотреть
                        в его профиле.
                    </Text>
                    <Text weight='semibold' className={styles.videoHeader}>Объясняю, как это все работает</Text>
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
                        before={<Icon16StarCircle />}
                        onClick={() => push({view: 'raiting', panel: 'raiting'})}
                    >
                        Рейтинг дизайнеров
                    </Button>
                    <Button
                        stretched
                        size='l'
                        className={styles.button}
                        before={<Icon24Gallery />}
                        onClick={() => push({view: 'gallery', panel: 'gallery'})}
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