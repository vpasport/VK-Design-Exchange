import Container from '../../../components/Container';
import Header from '../../../components/Header';
import { useEffect, useState } from 'react';

import dynamic from 'next/dynamic';

const Previews = dynamic(
    () => import('../../../components/Previews'),
    { ssr: false }
)

const Portfolios = ({ user }) => {
    return (
        <Container>
            <Header
                user={user}
                url='/admin/portfolios'
            />
            <Previews 
                user={user}
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

export default Portfolios;