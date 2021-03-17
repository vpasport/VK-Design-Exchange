import React from 'react';
import PropTypes from 'prop-types';
import { Panel, PanelHeader, PanelHeaderBack, Group } from '@vkontakte/vkui';
import useRouter from '../../utils/useRouter';
import ListBlock from '../../components/ListBlock';
import ReviewCard from '../../components/ReviewCard';
import useUserListParams from '../../utils/useUserListParams';

const Reviews = ({ id }) => {

    const router = useRouter();
    const userListParams = useUserListParams('reviews');

    const activeDesigner = userListParams.bind.activeDesigner;

    return (
        <Panel id={id}>
            <PanelHeader left={
                <PanelHeaderBack onClick={router.back} />
            }>
                Отзывы
            </PanelHeader>
            <Group>
                { userListParams.bind.isShowList &&
                    <ListBlock
                        actionType='reviews'
                        loadList={activeDesigner.getReviews.bind(activeDesigner)}
                        loadingCondition={userListParams.checkId}
                        nullText='Отзывы отсутствуют'
                    >
                        {el => (
                            <ReviewCard
                                reviewCard={el}
                                key={el.getId()}
                            />
                        )}
                    </ListBlock>
                }
            </Group>
        </Panel>   
    )
}

Reviews.propTypes = {
    id: PropTypes.string.isRequired
}

export default Reviews;