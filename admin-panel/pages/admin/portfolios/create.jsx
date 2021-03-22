import { useRouter } from 'next/router';
import Container from '../../../components/Container';
import Header from '../../../components/Header';
import { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';

import dynamic from 'next/dynamic';

const CreatePortfolio = dynamic(
    () => import('../../../components/CreatePortfolio'),
    { ssr: false }
)

const Create = ({ user }) => {
    const router = useRouter();
    const designer_id = router.query.designer_id;

    const [designer, setDesigner] = useState(null);
    const [tags, setTags] = useState(null);

    const [selectTags, setSelectTags] = useState([]);
    const [portfolio, setPortfolio] = useState(
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

    const [creation, setCreation] = useState(false);

    const set = (json) => {
        setPortfolio(prev => ({
            ...prev, ...json
        }));
    }

    useEffect(async () => {
        let response;

        if (designer_id !== undefined) {
            response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/designers/${designer_id}`);
            const { designer } = await response.json();

            setDesigner(designer);
        }

        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`);
        const { tags } = await response.json();

        setTags(tags);
    }, [])

    const setSelectedTags = (val) => {
        setSelectTags(val);
        set({ tags: val });
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

        for (const val of Object.values(portfolio)) {
            if (val === null) {
                setError('Заполние все поля');
                setDialog(true);
                return;
            }
        }

        if (preview === null) {
            setError('Вы не выбрали изображение для превью');
            setDialog(true);
            return;
        }
        if (workImage === null) {
            setError('Вы не выбрали изображение выполненной работы');
            setDialog(true);
            return;
        }

        const formData = new FormData();

        let tag_ids = [];
        selectTags.forEach(element => tag_ids.push(element.id));

        formData.append('preview', preview);
        formData.append('image', workImage);
        formData.append('title', portfolio.title);
        formData.append('description', portfolio.description);
        formData.append('project_description', portfolio.project_description);
        formData.append('task_description', portfolio.task_description);
        formData.append('completed_work', portfolio.complited_work);
        formData.append('designer_id', designer_id);
        formData.append('tag_ids', tag_ids);


        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio/work`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if (response.status !== 200) {
            setError('Не удалось создать портолио');
            setDialog(true);
            return;
        }

        const { id } = await response.json();

        router.push(`/admin/portfolios/${id}`);
    }

    return (
        <Container>
            <Header
                user={user}
                url='/admin/portfolios'
            />
            <CreatePortfolio
                designer={designer}
                tags={tags}
                selectTags={selectTags} setSelectTags={setSelectedTags}
                previewUrl={previewUrl} uploadPreview={uploadPreview}
                workUrl={workUrl} uploadWork={uploadWork}
                set={set} save={save}
                creation={creation} setCreation={setCreation}
            ></CreatePortfolio>
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

export default Create;