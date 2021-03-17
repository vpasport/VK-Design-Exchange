import Container from '../../../components/Container';
import Header from '../../../components/Header';
import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';

import dynamic from 'next/dynamic';

const TagsTable = dynamic(
    () => import('../../../components/TagsTable'),
    { ssr: false }
)

const Tags = ({ user }) => {
    const [tags, setTags] = useState(null);
    const [create, setCrete] = useState(false);
    const [name, setName] = useState('');

    const [error, setError] = useState();
    const [dialog, setDialog] = useState(false);

    useEffect(async () => {
        const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags/`);
        const { tags } = await result.json();

        setTags(tags);
    }, [])

    const createTag = async () => {
        setError('');
        if (name !== '') {
            let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name
                })
            })

            if (response.status !== 200) {
                setError('Не удалось создать тэг');
                setDialog(true);
                return;
            }

            response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags/`);
            const { tags } = await response.json();

            setTags(tags);

            return;
        }

        setError('Заполните поле названия тэга');
        setDialog(true);
    }

    const deleteTag = async (id) => {
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags/`);
        const { tags } = await response.json();

        setTags(tags);
    }

    const updateTag = async (id, name) => {
        setError('')
        if (name !== '') {
            let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name
                })
            })

            if (response.status !== 204) {
                setError('Не удалось изменить тэг');
                setDialog(true);
                return;
            }

            response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags/`);
            const { tags } = await response.json();

            setTags(tags);

            return;
        }

        setError('Заполните поле названия тэга');
        setDialog(true);
    }

    return (
        <Container>
            <Header
                user={user}
                url='/admin/tags'
            />
            <div className='p-m-6' style={{ textAlign: 'center' }}>
                {!create &&
                    <Button
                        label='Создать'
                        onClick={() => setCrete(true)}
                    >
                    </Button>}
                {create &&
                    <>
                        <InputText
                            placeholder='Название'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        >
                        </InputText>
                        <Button
                            className='p-ml-2'
                            label='Создать'
                            onClick={() => createTag()}
                        ></Button>
                        <Button
                            className='p-ml-2 p-button-danger'
                            label='Отмена'
                            onClick={() => setCrete(false)}
                        ></Button>
                    </>
                }
            </div>
            <TagsTable
                tags={tags}
                deleteTag={deleteTag}
                updateTag={updateTag}
            ></TagsTable>
            <Dialog header="Ошибка" visible={dialog} style={{ width: '50vw' }} onHide={() => setDialog(false)}>
                <p>
                    {error}
                </p>
            </Dialog>
        </Container>
    )
}

export async function getServerSideProps({ req: { headers: { cookie } }, res }) {
    let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/role`, {
        headers: {
            cookie
        }
    });
    const { role } = await response.json();

    if (role === undefined || role.indexOf('admin') === -1) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/info`, {
        headers: {
            cookie
        }
    });
    const { user } = await response.json();

    return {
        props: {
            user
        }
    }
}

export default Tags;