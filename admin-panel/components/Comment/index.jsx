import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useState } from "react";

const { Avatar } = require("primereact/avatar")

const Comment = ({
    vkUser, text,
    date, id,
    user, getComments
}) => {
    const [_date, setDate] = useState(new Date((Number(date) + new Date().getTimezoneOffset() * 60) * 1000))

    const [error, setError] = useState('');

    const [banDialog, setBanDialog] = useState(false);

    const [deleteDialog, setDeleteDialog] = useState(false);

    const banUser = async (delete_comment) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/ban`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                vk_id: vkUser.id,
                delete_comment
            })
        })

        if (!response.ok) {
            setError('Ошибка при блокировке пользователя');
            return;
        } else {
            if (response.status !== 204) {
                const { error } = await response.json();

                if (error) {
                    setError('Пользователь уже заблокирован');
                    return;
                }
            }

            setBanDialog(false);
            getComments();
        }
    }

    const deleteComment = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio/comment`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id
            })
        })

        if (!response.ok) {
            setError('Не удалось удалить комментарий');
            return;
        }

        setDeleteDialog(false);
        getComments();
    }

    return (
        <>
            <div className='p-d-flex p-ai-center p-mt-6 p-mb-6'>
                <Avatar shape='circle' image={vkUser.photo_max} size="xlarge" />
                <div className='p-ml-4'>
                    <div className='p-d-inline-flex p-ai-center'>
                        <b>{vkUser.first_name} {vkUser.last_name}</b> <div className='p-ml-3'>{_date.toLocaleString('ru-RU')}</div>
                        {user?.mainRole === 'admin' &&
                            <div>
                                <Button
                                    label='Заблокировать'
                                    icon='pi pi-ban'
                                    className='p-button-danger p-ml-3'
                                    onClick={() => setBanDialog(true)}
                                />
                                <Button
                                    label='Удалить комментрарий'
                                    icon='pi pi-trash'
                                    className='p-button-danger p-ml-3'
                                    onClick={() => setDeleteDialog(true)}
                                />
                            </div>
                        }
                    </div>
                    <hr></hr>
                    <div>
                        {text}
                    </div>
                </div>
            </div>
            <Dialog
                header='Заблокировать пользователя'
                visible={banDialog}
                style={{ width: '50vw' }}
                onHide={() => setBanDialog(false)}
            >
                При блокировке пользователя также удаляются комментарии. Вы можете удалить только этот комментарий или все комментарии данного пользователя.
                <div className='p-mt-4'>
                    <Button
                        label='Удалить этот комментарий'
                        className='p-button-danger'
                        onClick={() => banUser(id)}
                    />
                    <Button
                        label='Удалить все комментарии'
                        className='p-ml-3 p-button-danger'
                        onClick={() => banUser('all')}
                    />
                    <Button
                        label='Отмена'
                        className='p-ml-3'
                        onClick={() => setBanDialog(false)}
                    />
                </div>
            </Dialog>
            <Dialog
                header='Удалить комментарий'
                visible={deleteDialog}
                style={{ width: '50vw' }}
                onHide={() => setDeleteDialog(false)}
            >
                Вы уверены, что хотите удалить комментарий?
                <div className='p-mt-4'>
                    <Button
                        label='Удалить этот комментарий'
                        className='p-button-danger'
                        onClick={() => deleteComment()}
                    />
                    <Button
                        label='Отмена'
                        className='p-ml-3'
                        onClick={() => setDeleteDialog(false)}
                    />
                </div>
            </Dialog>
            <Dialog
                header='Ошибка'
                visible={error.length > 0}
                style={{ width: '50vw' }}
                onHide={() => setError('')}
            >
                {error}
            </Dialog>
        </>
    )
}

export default Comment;