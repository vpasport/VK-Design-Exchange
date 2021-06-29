import { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';

import dynamic from 'next/dynamic';

import Container from '../../../components/Container';
import Header from '../../../components/Header';

const TagsTable = dynamic(
    () => import('../../../components/TagsTable'),
    { ssr: false }
)

const Tags = ({ user }) => {
    const [name, setName] = useState('');

    const [error, setError] = useState();
    const [dialog, setDialog] = useState(false);
    const [create, setCreate] = useState(false);

    return (
        <Container>
            <Header
                user={user}
                url='/admin/tags'
            />
            <div className='p-mt-4 p-mb-6'>
                <TagsTable
                    setDialog={setDialog}
                    setError={setError}
                />
            </div>
            <Dialog header="Ошибка" visible={dialog} style={{ width: '50vw' }} onHide={() => setDialog(false)}>
                <p>
                    {error}
                </p>
            </Dialog>
            <Dialog
                header='Добавить тэг'
                visible={create}
                style={{ width: '50vw' }}
                onHide={() => setCreate(false)}
            >
                <InputText
                    placeholder='Название'
                    value={name}
                    style={{ width: '100%' }}
                    onChange={(e) => setName(e.target.value)}
                >
                </InputText>
                <br />
                <Button
                    className='p-mt-3'
                    label='Создать'
                    onClick={() => createTag()}
                ></Button>
            </Dialog>
        </Container>
    )
}

export async function getServerSideProps({ req: { headers: { cookie } } }) {
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

export default Tags;