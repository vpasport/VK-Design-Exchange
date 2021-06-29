import Container from '../../../components/Container';
import Header from '../../../components/Header';
import style from './style.module.scss';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Previews = dynamic(
    () => import('../../../components/Previews'),
    { ssr: false }
)

const Portfolio = ({ user }) => {
    const router = useRouter();

    const [previews, setPreviews] = useState();
    const [dialog, setDialog] = useState(false);

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
            <div
                style={{
                    width: '90%',
                    margin: 'auto'
                }}
            >
                <h2>Гайды по упаковке кейсов:</h2>
                <div
                    className={`p-m-4 ${style.card}`}
                >
                    <Image
                        src={'/images/animatePreview.jpg'}
                        width={398}
                        height={398}
                    />
                    <div
                        className='p-m-4'
                    >
                        <Button
                            label='Смотреть видео'
                            onClick={() => setDialog(true)}
                        />
                    </div>
                </div>
            </div>
            <Previews
                previews={previews}
                user={user}
            ></Previews>
            <Dialog header='Создание анимации для кейса на доске почета' visible={dialog} style={{ width: '50vw', minWidth: '700px' }} onHide={() => setDialog(false)}>
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
                </div>
            </Dialog>
        </Container >
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