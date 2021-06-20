import Container from '../../../components/Container';
import Header from '../../../components/Header';
import style from './style.module.scss';

import { Button } from 'primereact/button';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Previews = dynamic(
    () => import('../../../components/Previews'),
    { ssr: false }
)

const Portfolio = ({ user }) => {
    const router = useRouter();

    const [previews, setPreviews] = useState();

    const getPreviews = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/designers/${user.db.did}/previews`);
        const { previews } = await response.json();

        setPreviews(previews);
    }

    useEffect(() => {
        getPreviews();
    }, [])

    return (
        <Container>
            <Header
                user={user}
                url='/designer/portfolio'
            ></Header>
            <div className='p-m-4' style={{ textAlign: 'center' }}>
                <div className={style.videoContainer}>
                    <iframe
                        className={style.videoContainer__video}
                        src="https://www.youtube.com/embed/vL117frmxUI"
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                    >
                    </iframe>
                </div>
                <Button
                    label='Добавить работу'
                    icon='pi pi-plus'
                    onClick={() => router.push(`${process.env.NEXT_PUBLIC_BASE_PATH}/designer/portfolio/create`)}
                >
                </Button>
            </div>
            <Previews
                previews={previews}
                user={user}
            ></Previews>
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

export default Portfolio;