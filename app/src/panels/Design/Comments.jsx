import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Group, FixedLayout, WriteBar, WriteBarIcon, Text } from '@vkontakte/vkui';
import CommentsClass from '../../utils/Gallery/Design/Comments';
import ListBlock from '../../components/ListBlock';
import CommentsCard from '../../components/CommentCard';

import styles from './style.module.scss';
import useInput from '../../utils/useInput';
import { alertContext, sessionContext } from '../../App';
import { useSelector } from 'react-redux';

const Comments = ({ id }) => {

    const commentsList = useMemo(() => new CommentsClass(id), []);
    const comment = useInput('');
    const [groupRef, setGroupRef] = useState(null);
    const { activeUser } = useSelector(state => state.user);
    const { isDesktop } = sessionContext();

    const { useAlert } = alertContext();

    const sendComment = async () => {
        try {
            await commentsList.createComment(comment.value);
            window.scrollTo({ top: groupRef.offsetTop - 100, behavior: 'smooth' });
            comment.clear();
        }
        catch (e) {
            useAlert.show('Ошибка', e.message);
        }
    }

    const WBar = (
        <>
            {activeUser.banned ?
                <div className={styles.banned}>
                    <Text>Вы больше не можете отправлять комментарии</Text>
                </div>
                :
                <WriteBar
                    after={
                        <WriteBarIcon
                            mode='send'
                            onClick={sendComment}
                            disabled={!comment.value.length}
                        />
                    }
                    placeholder='Комментарий'
                    {...comment}
                />
            }
        </>
    )

    const WriteBarOrDiv = () => {
        if (isDesktop) return React.createElement('div', null, WBar);
        
        return React.createElement(FixedLayout, {vertical: 'bottom'}, WBar)
    }

    return (
        <Group className={styles.commentsBlock} getRootRef={el => setGroupRef(el)}>
            {WriteBarOrDiv()}
            <ListBlock
                loadCount={10}
                loadList={commentsList.getComments.bind(commentsList)}
                actionType='commentsList'
                loadingCondition={() => true}
                showScrollTop={false}
                nullText='Комментарии отсутствуют'
                hideFilter={true}
            >
                {el => (
                    <CommentsCard
                        comment={el}
                        key={el.id}
                    />
                )}
            </ListBlock>
        </Group>
    )
}

export default Comments;