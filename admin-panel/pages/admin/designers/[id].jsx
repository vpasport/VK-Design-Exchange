import Container from '../../../components/Container';
import Header from '../../../components/Header';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Dialog } from 'primereact/dialog';

import dynamic from 'next/dynamic';

const DesignerCard = dynamic(
    () => import('../../../components/DesignerCard'),
    { ssr: false }
)

const Designer = ({ user }) => {
    const router = useRouter();
    const id = router.query.id;

    const [designer, setDesigner] = useState(null);
    const [edit, setEdit] = useState(false);
    const [error, setError] = useState();
    const [dialog, setDialog] = useState(false);

    const getPropfile = async () => {
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/designers/${id}`, {
            credentials: 'include'
        });
        const { designer } = await response.json()

        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/designers/${id}/previews`, {
            credentials: 'include'
        });
        const { previews } = await response.json();

        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/designers/${id}/reviews`, {
            credentials: 'include'
        });
        const { reviews } = await response.json();

        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/designers/${id}/offers`, {
            credentials: 'include'
        });
        const { offers } = await response.json();

        designer.previews = previews;
        designer.reviews = reviews;
        designer.offers = offers;

        setDesigner(designer);
    }

    useEffect(() => {
        getPropfile();
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

        getPropfile();

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
            <div style={{ textAlign: 'center' }} className='p-mt-6'>
                <Button label='Удалить' className='p-m-2 p-button-danger' onClick={() => deleteDesigner()}></Button>
            </div>
            <DesignerCard
                designer={designer}
                user={user}
                edit={edit} setEdit={setEdit}
                update={updateDesigner}
            />
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
    const { role, user: _user, mainRole } = await response.json();

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

    user.role = role;
    user.db = _user;
    user.mainRole = mainRole;

    return {
        props: {
            user
        }
    }
}

export default Designer;