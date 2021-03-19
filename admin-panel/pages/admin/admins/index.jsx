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

    const [admins, setAdmins] = useState(null);

    const [createAdminProfile, setcreateAdminProfile] = useState(false);
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
        setcreateAdminProfile(false);
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
            setError('Не удалось создать администратора');
            setDialog(true);
            return;
        }

        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admins/`, {
            credentials: 'include'
        })
        const { admins } = await response.json();

        setAdmins(admins);
        setcreateAdminProfile(false);
    }

    return (
        <Container>
            <Header
                user={user}
                url='/admin/admins'
            />
            {createAdminProfile ?
                <div>
                    <CreateUser
                        link={link}
                        setLink={setLink}
                        create={createAdmin}
                    />
                </div>
                :
                <div style={{ textAlign: 'center' }}>
                    <Button
                        label='Создать'
                        className='p-mt-4'
                        onClick={() => setcreateAdminProfile(true)}
                    />
                </div>
            }
            <AdminTable
                admins={admins}
                deleteAdmin={deleteAdmin}
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

export default Admins;