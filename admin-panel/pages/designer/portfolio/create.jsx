import Container from "../../../components/Container";
import Header from "../../../components/Header";

import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from 'primereact/progressspinner';

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { useRouter } from "next/router";

const CreatePortfolio = dynamic(
    () => import('../../../components/CreatePortfolio'),
    { ssr: false }
);

const Create = ({ user }) => {
    const router = useRouter();

    const [error, setError] = useState();
    const [dialog, setDialog] = useState(false);
    const [progress, setProgress] = useState(false);

    const [tags, setTags] = useState(null);

    const [selectTags, setSelectTags] = useState([]);
    const [portfolio, setPortfolio] = useState(
        {
            title: null,
            project_description: null
        }
    );
    const [preview, setPreview] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [workImage, setWorkImage] = useState(null);
    const [workUrl, setWorkUrl] = useState(null);

    const [creation, setCreation] = useState(false);

    const set = (json) => {
        setPortfolio(prev => ({
            ...prev, ...json
        }));
    }

    const getTags = async () => {
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`);
        const { tags } = await response.json();

        setTags(tags);
    }

    useEffect(() => {
        getTags();
    }, []);

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
                setCreation(false);
                return;
            }
        }

        if (preview === null) {
            setError('Вы не выбрали изображение для превью');
            setDialog(true);
            setCreation(false);
            return;
        }
        if (workImage === null) {
            setError('Вы не выбрали изображение выполненной работы');
            setDialog(true);
            setCreation(false);
            return;
        }

        const formData = new FormData();

        let tag_ids = [];
        selectTags.forEach(element => tag_ids.push(element.id));

        formData.append('preview', preview);
        formData.append('image', workImage);
        formData.append('title', portfolio.title);
        formData.append('project_description', portfolio.project_description);
        formData.append('designer_id', user.db.did);
        formData.append('tag_ids', tag_ids);


        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio/work`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if (response.status !== 200) {
            setError('Не удалось создать портолио');
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
                url='/designer/portfolio'
            />
            <CreatePortfolio
                tags={tags}
                selectTags={selectTags} setSelectTags={setSelectedTags}
                previewUrl={previewUrl} uploadPreview={uploadPreview}
                workUrl={workUrl} uploadWork={uploadWork}
                set={set} save={save}
                creation={creation} setCreation={setCreation}
                portfolio={portfolio} setProgress={setProgress}
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