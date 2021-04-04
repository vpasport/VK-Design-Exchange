import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Container from "../../../components/Container";
import Header from "../../../components/Header";
import MyOrder from '../../../components/Order';

const Order = ({ user }) => {
    const router = useRouter();
    const id = router.query.id;

    const [order, setOrder] = useState(null);

    const getOrder = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
            credentials: 'include'
        })
        const { order } = await response.json();

        setOrder(order);
    }

    useEffect(() => {
        getOrder();
    }, [])

    return (
        <Container>
            <Header
                user={user}
                url='/admin/orders'
            />
            <MyOrder 
                order={order}
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

export default Order;