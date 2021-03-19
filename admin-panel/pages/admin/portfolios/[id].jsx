import Container from '../../../components/Container';
import Header from '../../../components/Header';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import dynamic from 'next/dynamic';

const WorkCard = dynamic(
    () => import('../../../components/WorkCard'),
    { ssr: false }
)

const Work = ({ user }) => {
    const router = useRouter();
    const id = router.query.id;

    const [work, setWork] = useState(null);
    const [edit, setEdit] = useState(false);

    const [tags, setTags] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const [updateWork, setUpdateWork] = useState(
        {
            title: null,
            description: null,
            project_description: null,
            task_description: null,
            complited_work: null
        }
    );
    const [preview, setPreview] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [workImage, setWorkImage] = useState(null);
    const [workUrl, setWorkUrl] = useState(null);

    const [error, setError] = useState();
    const [dialog, setDialog] = useState(false);

    const getWork = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio/work/${id}`, {
            credentials: 'include'
        });
        const { work } = await response.json()

        setWork(work);
        setUpdateWork({
            title: work.title,
            description: work.description,
            project_description: work.project_description,
            task_description: work.task_description,
            completed_work: work.completed_work
        })
        setWorkUrl(`${process.env.NEXT_PUBLIC_API_URL}/${work.work_image}`);
        setPreviewUrl(`${process.env.NEXT_PUBLIC_API_URL}/${work.preview}`);
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

    const uploadWork = ({ target }) => {
        const file = target.files[0];

        if (file) {
            if (file.size / 1024 / 1024 / 20 > 1) {
                target.value = "";
            } else {
                setWorkUrl(URL.createObjectURL(file));
                setWorkImage(file);
            }
        }
    }

    const save = async () => {
        setError('');

        let tags = [];

        selectedTags.forEach(el => tags.push(el.id));

        // let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio/${work.id}/tags`, {
        //     method: 'PUT',
        //     credentials: 'include',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         tag_ids: tags
        //     })
        // });

        // if (response.status !== 204) {
        //     setError('Не удалось обновить тэги. Обновление остановлено');
        //     setDialog(true);
        //     return;
        // }

        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio/${work.id}/description`, {
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
            return;
        }

        getWork();
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

        router.push('/admin/portfolios');
    }

    return (
        <Container>
            <Header
                user={user}
                url='/admin/portfolios'
            />
            <div style={{ width: '40%', margin: 'auto' }} className='p-mt-6'>
                <Button label='Редактировать' className='p-m-2' disabled={edit} onClick={() => setEdit(true)}></Button>
                {edit && <Button label='Отменить' className='p-m-2' disabled={!edit} onClick={() => setEdit(false)} />}
                <Button label='Удалить' className='p-m-2 p-button-danger' onClick={() => deletePortfolio()}></Button>
            </div>
            <WorkCard
                work={work}
                edit={edit}
                tags={tags} selectedTags={selectedTags} setSelectedTags={setSelectedTags}
                updateWork={updateWork} set={set}
                uploadWork={uploadWork} workUrl={workUrl}
                uploadPreview={uploadPreview} previewUrl={previewUrl}
                save={save}
            />
            <Dialog header="Ошибка" visible={dialog} style={{ width: '50vw' }} onHide={() => setDialog(false)}>
                <p>
                    {error}
                </p>
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
    const { role } = await response.json();

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

export default Work;