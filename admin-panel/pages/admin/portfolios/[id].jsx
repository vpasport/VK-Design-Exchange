import Container from '../../../components/Container';
import Header from '../../../components/Header';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import WorkCard from '../../../components/WorkCard';
import Link from 'next/link';
import { Button } from 'primereact/button';

const Work = ({ user }) => {
    const router = useRouter();
    const id = router.query.id;

    const [work, setWork] = useState(null);
    const [edit, setEdit] = useState(false);

    useEffect(async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio/work/${id}`, {
            credentials: 'include'
        });
        const json = await response.json()

        setWork(json?.work);
    }, [])

    return (
        <Container>
            <Header
                user={user}
                url='/admin/portfolios'
            />
            <div style={{ width: '40%', margin: 'auto' }} className='p-mt-6'>
                <Button label='Редактировать' className='p-m-2' disabled={edit} onClick={() => setEdit(true)}></Button>
                {edit && <Button label='Отменить' className='p-m-2' disabled={!edit} onClick={() => setEdit(false)} />}
                <Button label='Удалить' className='p-m-2 p-button-danger'></Button>
            </div>
            <WorkCard work={work} edit={edit} />

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

export default Work;