import Container from '../../../components/Container';
import Header from '../../../components/Header';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from 'primereact/button';
import CreateUser from '../../../components/CreateUser';
import { Dialog } from 'primereact/dialog';
import { useRouter } from 'next/router';

const DesignersTable = dynamic(
    () => import('../../../components/DesignersTable'),
    { ssr: false }
)

const Designers = ({ user }) => {
    const router = useRouter();

    const [designers, setDesigners] = useState(null);

    const [error, setError] = useState();
    const [dialog, setDialog] = useState(false);

    const [creareDesignerProfile, setCreateDesignerProfile] = useState(false);
    const [link, setLink] = useState('');

    useEffect(async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/designers/`);
        const { designers } = await res.json();

        setDesigners(designers);
    }, [])

    const deleteDesigner = async (id) => {
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

        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/designers/`);
        const { designers } = await response.json();

        setDesigners(designers);
    }

    const createProfile = () => {
        setDialog(true);
        setCreateDesignerProfile(true);
    }

    const createDesigner = async () => {
        setError('');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/designers/`, {
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
            setCreateDesignerProfile(false);
            setError('Не удалось создать дизайнер');
            setDialog(true);
            return;
        }

        const json = await response.json();

        router.push(`/admin/designers/${json.id}`);
    }

    return (
        <Container>
            <Header
                user={user}
                url='/admin/designers'
            />
            <div className='p-m-6' style={{ textAlign: 'center' }}>
                <Button
                    label='Cоздать'
                    onClick={() => createProfile()}
                >
                    {/* <Link href={`${process.env.NEXT_PUBLIC_SELF_URL}/admin/designers/create`}>Создать</Link> */}
                </Button>
            </div>
            <DesignersTable
                designers={designers}
                deleteDesigner={deleteDesigner}
            />
            <Dialog
                header={creareDesignerProfile ? 'Создать' : 'Ошибка'}
                visible={dialog}
                style={{ width: '50vw' }}
                onHide={() => {
                    if (creareDesignerProfile) setCreateDesignerProfile(false);
                    setDialog(false)
                    setError('')
                }}
            >
                <p>
                    {error}
                </p>
                {creareDesignerProfile &&
                    <div>
                        <CreateUser
                            link={link}
                            setLink={setLink}
                            create={createDesigner}
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

export default Designers;