import Container from '../../../components/Container';
import Header from '../../../components/Header';

import { Dialog } from 'primereact/dialog';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const DesignerCard = dynamic(
    () => import('../../../components/DesignerCard'),
    { ssr: false }
);

const Profile = ({ user }) => {
    const [designer, setDesigner] = useState();

    const [edit, setEdit] = useState(false);

    const [error, setError] = useState();
    const [dialog, setDialog] = useState(false);

    const getProfile = async () => {
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/designers/${user.db.did}`, {
            credentials: 'include'
        });
        const { designer } = await response.json();

        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/designers/${user.db.did}/previews`);
        const { previews } = await response.json();

        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/designers/${user.db.did}/reviews`, {
            credentials: 'include'
        });
        const { reviews } = await response.json();

        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/designers/${user.db.did}/offers`, {
            credentials: 'include'
        });
        const { offers } = await response.json();


        designer.previews = previews;
        designer.reviews = reviews;
        designer.offers = offers;

        setDesigner(designer);
    }

    useEffect(() => {
        getProfile();
    }, []);

    const update = async (_designer) => {
        if (_designer.specialization === null) _designer.specialization = designer.specialization;
        if (_designer.experience === null) _designer.experience = designer.experience;

        setError('');
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/designers/${user.db.did}`, {
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

        getProfile();

        setEdit(false);
        setDesigner(designer);
    }

    const updateEngaged = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/designers/${designer.id}/engaged`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                engaged: !designer.engaged,
            })
        })

        getProfile();
    }

    return (
        <Container>
            <Header
                user={user}
                url='/designer/profile'
            />
            <DesignerCard
                designer={designer}
                admin={false}
                edit={edit} setEdit={setEdit}
                update={update}
                user={user} updateEngaged={updateEngaged}
            ></DesignerCard>
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

    if (role === undefined || role.indexOf('designer') === -1) {
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

export default Profile;