import { useRouter } from 'next/router';
import Container from '../../../components/Container';
import Header from '../../../components/Header';
import { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';

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
            project_description: null,
            is_for_sale: false
        }
    );
    const [preview, setPreview] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [workImages, setWorkImages] = useState([]);

    const [error, setError] = useState();
    const [dialog, setDialog] = useState(false);
    const [progress, setProgress] = useState(false);

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

        if (selectTags.length === 0) {
            setError('Вы не выбрали тэги');
            setDialog(true);
            setCreation(false);
            setProgress(false);
            return;
        }
        for (const val of Object.values(portfolio)) {
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
        if (workImages.length === 0) {
            setError('Вы не выбрали изображения выполненной работы');
            setDialog(true);
            setCreation(false);
            setProgress(false);
            return;
        }

        let formData = new FormData();

        let tag_ids = [];
        selectTags.forEach(element => tag_ids.push(element.id));

        formData.append('preview', preview);
        formData.append('title', portfolio.title);
        formData.append('project_description', portfolio.project_description);
        formData.append('designer_id', designer_id);
        formData.append('tag_ids', tag_ids);
        formData.append('is_for_sale', portfolio.is_for_sale);

        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio/work`, {
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

        formData = new FormData();

        formData.append('designer_id', designer_id);
        for (let image of workImages) {
            formData.append('images', image.file);
        }

        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio/work/${id}/images`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if (!response.ok) {
            setError('Не удалось создать портолио');
            setDialog(true);
            setCreation(false);
            setProgress(false);
            return;
        }

        setProgress(false);

        router.push(`${process.env.NEXT_PUBLIC_BASE_PATH}/admin/portfolios/${id}`);
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
                uploadWork={uploadWork}
                set={set} save={save}
                creation={creation} setCreation={setCreation}
                portfolio={portfolio} setProgress={setProgress}
                setForSale={(val) => set({ is_for_sale: val })}
            ></CreatePortfolio>
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

export default Create;