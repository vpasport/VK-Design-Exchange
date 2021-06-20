import Container from "../../../components/Container";
import Header from "../../../components/Header";

import { Button } from 'primereact/button';

import dynamic from 'next/dynamic';
import { useRouter } from "next/router";

const MyOffers = dynamic(
    () => import('../../../components/Offers').then(o => {
        const { Offers } = o;
        Offers.__webpackChunkName = o.__webpackChunkName;
        return Offers;
    }),
    { ssr: false }
);

const Offers = ({ user }) => {
    const router = useRouter();

    return (
        <Container>
            <Header
                user={user}
                url='/designer/offers'
            />
            <div className='p-m-4' style={{ textAlign: 'center' }}>
                <Button
                    label='Добавить предложение'
                    icon='pi pi-plus'
                    onClick={() => router.push(`${process.env.NEXT_PUBLIC_BASE_PATH}/designer/offers/create`)}
                >
                </Button>
            </div>
            <MyOffers
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

export default Offers;