import Container from "../../../components/Container";
import Header from "../../../components/Header";

import { useRouter } from "next/router";
import dynamic from 'next/dynamic';
import { Dialog } from "primereact/dialog";
import { useEffect, useState, useRef } from "react";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";

const WorkCard = dynamic(
    () => import('../../../components/WorkCard'),
    { ssr: false }
)

const Work = ({ user }) => {
    const router = useRouter()
    const id = router.query.id;

    const [work, setWork] = useState(null);
    const [edit, setEdit] = useState(false);

    const [tags, setTags] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const [updateWork, setUpdateWork] = useState(
        {
            title: null,
            project_description: null
        }
    );
    const [preview, setPreview] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [workImages, setWorkImages] = useState([]);
    const [workUrl, setWorkUrl] = useState(null);

    const [error, setError] = useState();
    const [dialog, setDialog] = useState(false);
    const [progress, setProgress] = useState(false);

    const [change, setChange] = useState(false);

    const [deleteWork, setDeleteWork] = useState(false);

    const getWork = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio/work/${id}`, {
            credentials: 'include'
        });
        const { work } = await response.json()

        setWork(work);
        setUpdateWork({
            title: work.title,
            project_description: work.project_description,
            is_for_sale: work.is_for_sale
        })
        setPreviewUrl({ path: `${process.env.NEXT_PUBLIC_API_URL}/${work.preview}` });
    }

    useEffect(() => {
        getWork()
    }, [])

    useEffect(async () => {
        if (!edit) return;

        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`);
        const { tags } = await response.json();

        let tmp = []

        work?.tags.forEach(el => {
            tmp.push({ id: el.tag_id, name: el.name })
        })

        setTags(tags);
        setSelectedTags(tmp);
    }, [edit]);

    const set = (json) => {
        setUpdateWork(prev => ({
            ...prev, ...json
        }));
    }

    const getSquare = (path) => new Promise((resolve) => {
        const img = new Image();
        let square = false;

        img.onload = function () {
            if (this.width === this.height)
                square = true;

            resolve(square);
        }
        img.src = path;
    })

    const uploadPreview = async ({ target }) => {
        const file = target.files[0];

        if (file) {
            if (file.size / 1024 / 1024 / 5 > 1) {
                target.value = "";
            } else {
                let square = await getSquare(URL.createObjectURL(file));
                setPreviewUrl({
                    path: URL.createObjectURL(file),
                    square
                });
                setPreview(file);
            }
        }
    }

    const uploadWork = (images) => {
        setWorkImages(images);
    }

    const save = async () => {
        setError('');

        let tags = [];

        selectedTags.forEach(el => tags.push(el.id));

        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio/${work.id}/tags`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tag_ids: tags
            })
        });

        if (response.status !== 204) {
            setError('Не удалось обновить тэги. Обновление остановлено');
            setChange(false);
            setDialog(true);
            setProgress(false);
            return;
        }

        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio/${work.id}/description`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...updateWork
            })
        });

        if (response.status !== 204) {
            setError('Не удалось обновить описание работы. Обновление остановлено');
            setDialog(true);
            setChange(false);
            setProgress(false);
            return;
        }

        if (work.is_for_sale !== updateWork.is_for_sale) {
            response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio/${work.id}/for-sale`, {
                method: 'PUT',
                credentials: 'include'
            })

            if (!response.ok) {
                setError('Не удалось обновить описание работы. Обновление остановлено');
                setDialog(true);
                setChange(false);
                setProgress(false);
                return;
            }
        }

        const formData = new FormData();

        if (preview !== null) {
            formData.append('preview', preview);
            response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio/${work.id}/preview`, {
                method: 'PUT',
                credentials: 'include',
                body: formData
            });

            if (response.status !== 204) {
                setError('Не удалось обновить превью. Обновление остановлено');
                setChange(false);
                setDialog(true);
                setProgress(false);
                return;
            }
        }

        getWork();
        setEdit();
        setProgress(false);
        setChange(false);
    }

    const deletePortfolio = async () => {
        setError('');

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio/work`, {
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

        router.push(`${process.env.NEXT_PUBLIC_BASE_PATH}/designer/profile`);
    }

    const updateHidden = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio/${work.id}/hidden`, {
            method: 'PUT',
            credentials: 'include'
        })

        if (response.ok) {
            setWork(prev => ({
                ...prev,
                is_hidden: !prev.is_hidden
            }))
        }
    }

    return (
        <Container>
            <Header
                user={user}
                url='/designer/portfolio'
            />
            <div style={{ textAlign: 'center' }} className='p-mt-6'>
                <Button label={work?.is_hidden ? 'Открыть' : 'Скрыть'} className='p-m-2' icon={`pi pi-eye${work?.is_hidden ? '' : '-slash'}`} onClick={() => updateHidden()}></Button>
                <Button label='Редактировать' className='p-m-2' icon='pi pi-pencil' disabled={edit} onClick={() => setEdit(true)}></Button>
                {edit && <Button label='Отменить' className='p-m-2' disabled={!edit} onClick={() => setEdit(false)} />}
                <Button label='Удалить' className='p-m-2 p-button-danger' onClick={() => setDeleteWork(true)}></Button>
            </div>
            <WorkCard
                work={work}
                edit={edit}
                tags={tags} selectedTags={selectedTags} setSelectedTags={setSelectedTags}
                updateWork={updateWork} set={set}
                uploadWork={uploadWork} workUrl={workUrl}
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
                visible={deleteWork}
                style={{ width: '50vw' }}
                onHide={() => setDeleteWork(false)}
            >
                Вы уверены, что хотите удалить работу?
                <br />
                <div className='p-mt-4'>
                    <Button
                        label='Да'
                        onClick={() => deletePortfolio()}
                    />
                    <Button
                        className='p-ml-4'
                        label='Отмена'
                        onClick={() => setDeleteWork(false)}
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

export default Work;