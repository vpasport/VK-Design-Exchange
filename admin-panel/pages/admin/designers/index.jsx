import Container from '../../../components/Container';
import Header from '../../../components/Header';
import { useEffect, useState } from 'react';

import dynamic from 'next/dynamic';

const DesignersTable = dynamic(
    () => import('../../../components/DesignersTable'),
    { ssr: false }
)

const Designers = ({ user }) => {
    const [designers, setDesigners] = useState(null);

    useEffect(async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/designers/`);
        const { designers } = await res.json();

        setDesigners(designers);
    }, [])

    return (
        <Container>
            <Header
                user={user}
                url='/admin/designers'
            />
            <DesignersTable
                designers={designers}
            />
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