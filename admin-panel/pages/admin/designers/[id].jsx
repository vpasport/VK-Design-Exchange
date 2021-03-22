import Container from '../../../components/Container';
import Header from '../../../components/Header';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import DesignerCard from '../../../components/DesignerCard';
import { useRouter } from 'next/router';

import { Dialog } from 'primereact/dialog';

const Designer = ({ user }) => {
    const router = useRouter();
    const id = router.query.id;

    const [designer, setDesigner] = useState(null);
    const [edit, setEdit] = useState(false);
    const [error, setError] = useState();
    const [dialog, setDialog] = useState(false);

    useEffect(async () => {
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/designers/${id}`, {
            credentials: 'include'
        });
        const { designer } = await response.json()

        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/designers/${id}/previews`, {
            credentials: 'include'
        });
        const { previews } = await response.json();

        designer.previews = previews;

        setDesigner(designer);
    }, [])

    const updateDesigner = async (_designer) => {
        if (_designer.specialization === null) _designer.specialization = designer.specialization;
        if (_designer.experience === null) _designer.experience = designer.experience;

        setError('');
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/designers/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                bio: _designer?.bio,
            })
        })

        if (response.status !== 204) {
            setError('Не удалось обновить информацию о дизайнере');
            setDialog(true);
            return;
        }

        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/designers/${id}`, {
            credentials: 'include'
        });
        const { designer } = await response.json()

        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/designers/${id}/previews`, {
            credentials: 'include'
        });
        const { previews } = await response.json();

        designer.previews = previews;

        setEdit(false);
        setDesigner(designer);
    }

    const deleteDesigner = async () => {
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/designers/`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id
            })
        })

        router.push('/admin/designers');
    }

    return (
        <Container>
            <Header
                user={user}
                url='/admin/designers'
            />
            <div style={{ width: '40%', margin: 'auto' }} className='p-mt-6'>
                <Button label='Редактировать' className='p-m-2' disabled={edit} onClick={() => setEdit(true)}></Button>
                {edit && <Button label='Отменить' className='p-m-2' disabled={!edit} onClick={() => setEdit(false)} />}
                <Button label='Удалить' className='p-m-2 p-button-danger' onClick={() => deleteDesigner()}></Button>
            </div>
            <DesignerCard designer={designer} edit={edit} update={updateDesigner} />
            <Dialog header="Ошибка" visible={dialog} style={{ width: '50vw' }} onHide={() => setDialog(false)}>
                <p>
                    {error}
                </p>
            </Dialog>
        </Container >
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

export default Designer;