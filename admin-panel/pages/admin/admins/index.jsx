import Container from '../../../components/Container';
import Header from '../../../components/Header';
import { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import CreateUser from '../../../components/CreateUser';
import { Button } from 'primereact/button';

import dynamic from 'next/dynamic';

const AdminTable = dynamic(
    () => import('../../../components/AdminTable'),
    { ssr: false }
)

const Admins = ({ user }) => {
    const [error, setError] = useState();
    const [dialog, setDialog] = useState(false);

    const [admins, setAdmins] = useState();

    const [createAdminProfile, setCreateAdminProfile] = useState(false);
    const [link, setLink] = useState('');

    useEffect(async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admins/`, {
            credentials: 'include'
        })
        const { admins } = await response.json();

        setAdmins(admins);
    }, [])

    const deleteAdmin = async (id) => {
        setError('');
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admins/`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id
            })
        })

        if (response.status !== 204) {
            setError('Не удалось удалить администратора');
            setDialog(true);
            return;
        }

        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admins/`, {
            credentials: 'include'
        })
        const { admins } = await response.json();

        setAdmins(admins);
        setCreateAdminProfile(false);
    }

    const createAdmin = async () => {
        setError('')
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admins/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                vk_id: link
            })
        })

        if (response.status !== 200) {
            setCreateAdminProfile(false);
            setError('Не удалось создать администратора');
            setDialog(true);
            return;
        }

        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admins/`, {
            credentials: 'include'
        })
        const { admins } = await response.json();

        setAdmins(admins);
        setDialog(false);
        setCreateAdminProfile(false);
    }

    const createProfile = () => {
        setDialog(true);
        setCreateAdminProfile(true);
    }

    return (
        <Container>
            <Header
                user={user}
                url='/admin/admins'
            />
            <div style={{ textAlign: 'center' }}>
                <Button
                    label='Создать'
                    className='p-mt-4'
                    onClick={() => createProfile()}
                />
            </div>
            <AdminTable
                admins={admins}
                deleteAdmin={deleteAdmin}
            />
            <Dialog
                header={createAdminProfile ? 'Создать' : 'Ошибка'}
                visible={dialog}
                style={{ width: '50vw' }}
                onHide={() => {
                    if (createAdminProfile) setCreateAdminProfile(false);
                    setDialog(false);
                    setError('');
                }}
            >
                <p>
                    {error}
                </p>
                {createAdminProfile &&
                    <div>
                        <CreateUser
                            link={link}
                            setLink={setLink}
                            create={createAdmin}
                        />
                    </div>
                }
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

export default Admins;