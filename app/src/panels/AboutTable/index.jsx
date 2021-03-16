import React from 'react';
import PropTypes from 'prop-types';
import { Group, Panel, PanelHeader, Text, Div, Title, Button } from '@vkontakte/vkui';
import { Icon24Gallery } from '@vkontakte/icons';
import { Icon16StarCircle } from '@vkontakte/icons';

import styles from './style.module.scss';
import useRouter from '../../utils/useRouter';

const AboutTable = ({id}) => {

    const router = useRouter();

    return (
        <Panel id={id}>
            <PanelHeader>Доска почета</PanelHeader>
            <Group>
                <Div>
                    <Text>
                        На доске почета размещены дизайнеры, 
                        которые прошли мой авторский курс и получили за курсовую 
                        работу не менее 5 баллов.<br/><br/>
                        Работы, рейтинг и отзывы каждого дизайнера можно посмотреть 
                        в его профиле.
                    </Text>
                    <Text weight='semibold' className={styles.videoHeader}>Объясняю, как это все работает</Text>
                    <img src='https://via.placeholder.com/500x300' alt='video' className={styles.video}/>
                </Div>
            </Group>
            <Group>
                <Div>
                    <Title level='1' weight='bold'>Мои ученики</Title>
                    <Button 
                        stretched 
                        size='l' 
                        className={styles.button}
                        before={<Icon16StarCircle />}
                        onClick={() => router.setActiveStoryAndPanel('raiting', 'raiting')}
                        
                    >
                        Рейтинг дизайнеров
                    </Button>
                    <Button 
                        stretched 
                        size='l' 
                        className={styles.button}
                        before={<Icon24Gallery />}
                        onClick={() => router.setActiveStoryAndPanel('gallery', 'gallery')}
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