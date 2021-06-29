import Container from '../../../components/Container';
import Header from '../../../components/Header';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Dialog } from 'primereact/dialog';
import CreateUser from '../../../components/CreateUser';

const Create = ({ user }) => {
    const router = useRouter();

    const [link, setLink] = useState();
    const [error, setError] = useState();
    const [dialog, setDialog] = useState(false);

    const create = async () => {
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
            <div style={{ margin: 'auto' }}>
                <div>
                    <CreateUser
                        link={link}
                        setLink={setLink}
                        create={create}
                    />
                    <Dialog header="Ошибка" visible={dialog} style={{ width: '50vw' }} onHide={() => setDialog(false)}>
                        <p>
                            {error}
                        </p>
                    </Dialog>
                </div>
            </div>
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

export default Create;