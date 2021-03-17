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
            tags: null,
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

    useEffect(() => {
        console.log(preview)
    }, [preview])

    const uploadPreview = ({target}) => {
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

    const uploadWork = ({target}) => {
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

        console.log(portfolio)
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