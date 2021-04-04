import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";

import Container from "../../../components/Container";
import Header from "../../../components/Header";

import dynamic from 'next/dynamic';
import { useState } from "react";
import { useRouter } from "next/router";

const CreateOffer = dynamic(
    () => import('../../../components/CreateOffer'),
    { ssr: false }
)

const Create = ({ user }) => {
    const router = useRouter();

    const [error, setError] = useState();
    const [dialog, setDialog] = useState(false);
    const [progress, setProgress] = useState(false);

    const [offer, setOffer] = useState({
        title: null,
        description: null,
        price: null
    });
    const [preview, setPreview] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [creation, setCreation] = useState(false);

    const set = (json) => {
        setOffer(prev => ({
            ...prev, ...json
        }));
    }

    const uploadPreview = ({ target }) => {
        const file = target.files[0];

        if (file) {
            if (file.size / 1024 / 1024 / 5 > 1) {
                target.value = "";
            } else {
                setPreviewUrl(URL.createObjectURL(file));
                setPreview(file);
            }
        }
    }

    const save = async () => {
        setError('');

        for (const val of Object.values(offer)) {
            if (val === null) {
                setError('Заполние все поля');
                setDialog(true);
                setCreation(false);
                setProgress(false);
                return;
            }
        }

        if (preview === null) {
            setError('Вы не выбрали изображение для превью');
            setDialog(true);
            setCreation(false);
            setProgress(false);
            return;
        }

        const formData = new FormData();

        formData.append('preview', preview);
        formData.append('title', offer.title);
        formData.append('description', offer.description);
        formData.append('price', offer.price)
        formData.append('designer_id', user.db.did);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offers`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if (response.status !== 200) {
            setError('Не удалось создать предложение');
            setDialog(true);
            setCreation(false);
            setProgress(false);
            return;
        }

        const { id } = await response.json();

        setProgress(false);

        router.push(`/designer/profile`);
    }

    return (
        <Container>
            <Header
                user={user}
                url='/designer/offers'
            />
            <CreateOffer
                previewUrl={previewUrl} uploadPreview={uploadPreview}
                set={set} save={save}
                creation={creation} setCreation={setCreation}
                offer={offer}
                setProgress={setProgress}
            />
            <Dialog header="Ошибка" visible={dialog} style={{ width: '50vw' }} onHide={() => setDialog(false)}>
                <p>
                    {error}
                </p>
            </Dialog>
            <Dialog
                header="Загрузка"
                visible={progress}
                style={{ width: '200px', textAlign: 'center' }}
                closable={false}
            >
                <ProgressSpinner style={{ width: '30px', height: '30px' }} strokeWidth="4" animationDuration="1.5s" />
            </Dialog>
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

export default Create;