import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Group, FixedLayout, WriteBar, WriteBarIcon, Text, SimpleCell, Caption, IconButton } from '@vkontakte/vkui';
import CommentsClass from '../../utils/Gallery/Design/Comments';
import ListBlock from '../../components/ListBlock';
import CommentsCard from '../../components/CommentCard';
import { Icon24Share } from '@vkontakte/icons';
import { Icon16Cancel } from '@vkontakte/icons';
import OutlineCellButtonBlock from '../../components/OutlineCellButtonBlock';

import styles from './style.module.scss';
import useInput from '../../utils/useInput';
import { alertContext, sessionContext } from '../../App';
import { useSelector } from 'react-redux';

const Comments = ({ id }) => {

    const commentsList = useMemo(() => new CommentsClass(id), []);
    const comment = useInput('');
    const [choosenComment, setChoosenComment] = useState(null);
    const groupRef = useRef(null);
    const inputRef = useRef(null);
    const { activeUser } = useSelector(state => state.user);
    const { isDesktop } = sessionContext();

    const { useAlert } = alertContext();

    const sendComment = async () => {
        try {
            await commentsList.createComment(comment.value, choosenComment);
            window.scrollTo({ top: groupRef.current.offsetTop - 100, behavior: 'smooth' });
            comment.clear();
            setChoosenComment(null);
        }
        catch (e) {
            useAlert.show('Ошибка', e.message);
        }
    }

    const handleChooseComment = (changedComment) => {
        if(isDesktop) window.scrollTo({ top: inputRef.current.getBoundingClientRect().top + pageYOffset - 200, behavior: 'smooth'})
        inputRef.current.focus();

        setChoosenComment(changedComment);
    }

    const handleDeleteChoosenComment = (event) => {
        event.stopPropagation();

        setChoosenComment(null);
        inputRef.current.focus();
    }

    const scrollToComment = (id) => {
        const findedNode = document.getElementById(`comment${id}`);
        window.scrollTo({ top: findedNode.getBoundingClientRect().top + pageYOffset - 200 });

        findedNode.classList.add('outlineCellButton_active');

        setTimeout(() => findedNode.classList.remove('outlineCellButton_active'), 1000);
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
                    getRef={inputRef}
                    {...comment}
                />
            }
        </>
    )

    const choosenCommentNode = choosenComment && (
        <SimpleCell
            before={<Icon24Share />}
            description={<Caption weight='regular'>{choosenComment.text}</Caption>}
            after={
                <IconButton>
                    <Icon16Cancel onClick={handleDeleteChoosenComment} />
                </IconButton>
            }
            onClick={() => scrollToComment(choosenComment.id)}
            hasActive={false}
            hasHover={false}
        >
            <Caption weight='regular'>{choosenComment.userFullName}</Caption>
        </SimpleCell>
    )

    const WriteBarOrDiv = () => {
        if (isDesktop) return React.createElement('div', null, <>{WBar}{choosenCommentNode}</>);

        return React.createElement(FixedLayout, { vertical: 'bottom', filled: true }, <>{choosenCommentNode}{WBar}</>)
    }

    return (
        <Group className={styles.commentsBlock} getRootRef={groupRef}>
            {WriteBarOrDiv()}
            <div className={`outlineCellButtonBlock 
                ${Boolean(!isDesktop && choosenComment) && styles.commentsBlock_spacing}`}
            >
                <ListBlock
                    loadCount={10}
                    loadList={commentsList.getComments.bind(commentsList)}
                    actionType='commentsList'
                    loadingCondition={() => true}
                    showScrollTop={false}
                    nullText='Комментарии отсутствуют'
                    hideFilter={true}
                    useSpacing={false}
                >
                    {el => (
                        <CommentsCard
                            comment={el}
                            key={el.id}
                            onClick={() => handleChooseComment(el)}
                            scrollToComment={scrollToComment}
                        />
                    )}
                </ListBlock>
            </div>
        </Group>
    )
}

export default Comments;