import Container from "../../../components/Container";
import Header from "../../../components/Header";

import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from 'next/dynamic';
import { Button } from "primereact/button";

const OfferCard = dynamic(
    () => import('../../../components/OfferCard'),
    { ssr: false }
)

const Offer = ({ user }) => {
    const router = useRouter();
    const id = router.query.id;

    const [edit, setEdit] = useState(false);

    const [offer, setOffer] = useState(null);
    const [updateOffer, setUpdateOffer] = useState({
        title: null,
        description: null,
        price: null
    })
    const [previewUrl, setPreviewUrl] = useState(null);
    const [preview, setPreview] = useState(null);

    const [error, setError] = useState();
    const [dialog, setDialog] = useState(false);
    const [progress, setProgress] = useState(false);

    const [change, setChange] = useState(false);

    const [deleteOfferConf, setDeleteOfferConf] = useState(false);

    const getOffer = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offers/${id}`)
        const { offer } = await response.json();

        setOffer(offer);
        setUpdateOffer({
            title: offer.title,
            description: offer.description,
            price: offer.price
        })
        setPreviewUrl(`${process.env.NEXT_PUBLIC_API_URL}/${offer.preview}`)
    }

    useEffect(() => {
        getOffer();
    }, []);

    const set = (json) => {
        setUpdateOffer(prev => ({
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

        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offers/${offer.id}/description`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...updateOffer
            })
        });

        if (response.status !== 204) {
            setError('Не удалось обновить описание работы. Обновление остановлено');
            setDialog(true);
            setChange(false);
            setProgress(false);
            return;
        }

        const formData = new FormData();

        if (preview !== null) formData.append('preview', preview);

        if (preview !== null) {
            response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offers/${offer.id}/preview`, {
                method: 'PUT',
                credentials: 'include',
                body: formData
            });

            if (response.status !== 204) {
                setError('Не удалось обновить превью или изображение работы. Обновление остановлено');
                setChange(false);
                setDialog(true);
                setProgress(false);
                return;
            }
        }

        getOffer();
        setEdit();
        setProgress(false);
    }

    const deleteOffer = async () => {
        setError('');

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offers/`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id
            })
        })

        if (response.status !== 204) {
            setError('Произошла шибка при удалении');
            setDialog(true);
            return;
        }

        router.push(`${process.env.NEXT_PUBLIC_BASE_PATH}/admin/offers`);
    }

    return (
        <Container>
            <Header
                user={user}
                url='/admin/offers'
            />
            <div style={{ textAlign: 'center' }} className='p-mt-6'>
                <Button label='Редактировать' className='p-m-2' icon='pi pi-pencil' disabled={edit} onClick={() => setEdit(true)}></Button>
                {edit && <Button label='Отменить' className='p-m-2' disabled={!edit} onClick={() => setEdit(false)} />}
                <Button label='Удалить' className='p-m-2 p-button-danger' onClick={() => setDeleteOfferConf(true)}></Button>
            </div>
            <OfferCard
                offer={offer} edit={edit}
                set={set} updateOffer={updateOffer}
                uploadPreview={uploadPreview} previewUrl={previewUrl}
                save={save} setProgress={setProgress}
                change={change} setChange={setChange}
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
            <Dialog
                header='Внимание!'
                visible={deleteOfferConf}
                style={{ width: '50vw' }}
                onHide={() => setDeleteOfferConf(false)}
            >
                Вы уверены, что хотите удалить работу?
                <br />
                <div className='p-mt-4'>
                    <Button
                        label='Да'
                        onClick={() => deleteOffer()}
                    />
                    <Button
                        className='p-ml-4'
                        label='Отмена'
                        onClick={() => setDeleteOfferConf(false)}
                    />
                </div>
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

export default Offer;