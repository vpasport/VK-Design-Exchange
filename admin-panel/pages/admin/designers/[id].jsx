import Container from '../../../components/Container';
import Header from '../../../components/Header';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import DesignerCard from '../../../components/DesignerCard';
import { useRouter } from 'next/router';

const Designer = ({user}) => {
    const router = useRouter();
    const id = router.query.id;

    const [designer, setDesigner] = useState(null);
    const [edit, setEdit] = useState(false);

    useEffect( async () => {
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/designers/${id}`, {
            credentials: 'include'
        });
        const {designer} = await response.json()

        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/designers/${id}/previews`, {
            credentials: 'include'
        });
        const {previews} = await response.json();

        designer.previews = previews;

        setDesigner(designer);
    }, [] )

    return (
        <Container>
            <Header
                user={user}
                url='/admin/designers'
            />
            <div style={{ width: '40%', margin: 'auto' }} className='p-mt-6'>
                <Button label='Редактировать' className='p-m-2' disabled={edit} onClick={()=>setEdit(true)}></Button>
                {edit && <Button label='Отменить' className='p-m-2' disabled={!edit} onClick={()=>setEdit(false)}/>}
                <Button label='Удалить' className='p-m-2 p-button-danger'></Button>
            </div>
            <DesignerCard designer={designer} edit={edit} />

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

export default Designer;