import Container from '../../../components/Container';
import Header from '../../../components/Header';
import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';

import dynamic from 'next/dynamic';

const Previews = dynamic(
    () => import('../../../components/Previews'),
    {ssr: false}
)

const Portfolios = ({ user }) => {    
    const [previews, setPreviews] = useState(null);

    const getPreviews = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio/previews/`);

        const { previews } = await res.json();

        console.log(previews)

        setPreviews(previews);
    }

    useEffect(() => {
        getPreviews();
    }, [])

    return (
        <Container>
            <Header
                user={user}
                url='/admin/portfolios'
            />
            <Previews previews={previews} />
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
    console.log(role)

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

export default Portfolios;