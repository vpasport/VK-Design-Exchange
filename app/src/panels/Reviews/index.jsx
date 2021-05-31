import React from 'react';
import PropTypes from 'prop-types';
import { Panel, PanelHeader, PanelHeaderBack, Group } from '@vkontakte/vkui';
import {useRouter} from '@unexp/router';
import ReviewCard from '../../components/ReviewCard';
import useUserListParams from '../../utils/useUserListParams';
import UserListBlock from '../../components/UserListBlock';

const Reviews = ({ id }) => {

    const {back} = useRouter();

    return (
        <Panel id={id}>
            <PanelHeader left={
                <PanelHeaderBack onClick={back} />
            }>
                Отзывы
            </PanelHeader>
            <Group>
                <UserListBlock
                    actionType='reviews'
                    loadList='getReviews'
                    nullText='Отзывы отсутствуют'
                >
                    {el => (
                        <ReviewCard
                            reviewCard={el}
                            key={el.getId()}
                        />
                    )}
                </UserListBlock>
            </Group>
        </Panel>
    )
}

Reviews.propTypes = {
    id: PropTypes.string.isRequired
}

export default Reviews;