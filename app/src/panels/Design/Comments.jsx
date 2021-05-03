import React, {useMemo, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import { Group, FixedLayout, WriteBar, WriteBarIcon } from '@vkontakte/vkui';
import CommentsClass from '../../utils/Gallery/Design/Comments';
import ListBlock from '../../components/ListBlock';
import CommentsCard from '../../components/CommentCard';

import styles from './style.module.scss';
import useInput from '../../utils/useInput';
import { alertContext } from '../../App';

const Comments = ({id}) => {

    const commentsList = useMemo(() => new CommentsClass(id), []);
    const comment = useInput('');
    const [ groupRef, setGroupRef ] = useState(null);

    const { useAlert } = alertContext();

    const sendComment = async () => {
        try{
            await commentsList.createComment(comment.value);
            window.scrollTo({top: groupRef.offsetTop - 100, behavior: 'smooth'});
            comment.clear();
        }
        catch(e){
            useAlert.show('Ошибка', e.message);
        }
    }

    return (
        <Group className={styles.commentsBlock} getRootRef={el => setGroupRef(el)}>
            <ListBlock
                loadCount={10}
                loadList={commentsList.getComments.bind(commentsList)}
                actionType='commentsList'
                loadingCondition={() => true}
                showScrollTop={false}
                nullText='Комментарии отсутствуют'
            >
                {el => (
                    <CommentsCard comment={el} />
                )}
            </ListBlock>
            <FixedLayout vertical='bottom'>
                <WriteBar
                    after={
                        <WriteBarIcon 
                            mode='send' 
                            onClick={sendComment}
                        />
                    }
                    placeholder='Комментарий'
                    {...comment}
                />
            </FixedLayout>
        </Group>
    )
}

export default Comments;