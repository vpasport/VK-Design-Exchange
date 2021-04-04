import Container from "../../../components/Container";
import Header from "../../../components/Header";

import { Button } from "primereact/button";

import dynamic from 'next/dynamic';

const AllOffers = dynamic(
    () => import('../../../components/Offers').then(o => {
        const { AllOffers } = o;
        AllOffers.__webpackChunkName = o.__webpackChunkName;
        return AllOffers;
    }),
    {ssr: false}
)

const Offers = ({ user }) => {
    return (
        <Container>
            <Header
                user={user}
                url='/admin/offers'
            />
            <AllOffers
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

export default Offers;