import { Avatar } from 'primereact/avatar';
import { Rating } from 'primereact/rating';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import Link from 'next/link';
import { Calendar } from 'primereact/calendar';
import Quill from '../Quill';
import { useEffect, useState } from 'react';
import { InputSwitch } from 'primereact/inputswitch';

const DesignerCard = ({
    designer, edit, setEdit,
    update, admin = true,
    user, updateEngaged
}) => {
    const [designerUpdated, setDesignerUpdated] = useState(designer);
    const [date, setDate] = useState();

    const setDesigner = (json) => {
        setDesignerUpdated(prev => ({
            ...prev, ...json
        }));
    }

    useEffect(() => {
        setDesignerUpdated(designer);
    }, [designer]);

    const renderCard = (data, key) => {
        const footer = (
            <span key={key}>
                <Button>
                    {user.mainRole === 'admin' && <Link href={`${process.env.NEXT_PUBLIC_SELF_URL}/admin/portfolios/${data.id}`}>Обзор</Link>}
                    {user.mainRole === 'designer' && <Link href={`${process.env.NEXT_PUBLIC_SELF_URL}/designer/portfolio/${data.id}`}>Обзор</Link>}
                </Button>
            </span>
        );

        const header = (
            <img alt={data.title} src={`${process.env.NEXT_PUBLIC_API_URL}/${data?.preview}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} />
        );

        return (
            <Card
                key={key}
                className='p-m-2'
                style={{ width: '48%' }}
                title={data.title}
                footer={footer}
                header={header}
            >
                {/* <p className="p-m-0" style={{ lineHeight: '1.5' }}>{data.title}</p> */}
            </Card>
        );
    }

    const renderOfferCard = (data, key) => {
        const footer = (
            <div key={key} className='p-d-flex p-ai-center p-jc-between p-pl-4 p-pr-4'>
                <h3>Стоимость: {data.price}₽</h3>
                <Button>
                    {user.mainRole === 'admin' && <Link href={`${process.env.NEXT_PUBLIC_SELF_URL}/admin/offers/${data.id}`}>Обзор</Link>}
                    {user.mainRole === 'designer' && <Link href={`${process.env.NEXT_PUBLIC_SELF_URL}/designer/offers/${data.id}`}>Обзор</Link>}
                </Button>
            </div>
        );

        const header = (
            <img alt={data.title} src={`${process.env.NEXT_PUBLIC_API_URL}/${data?.preview}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} />
        );

        return (
            <Card
                key={key}
                className='p-m-2'
                style={{ width: '48%' }}
                title={data.title}
                footer={footer}
                header={header}
            >
            </Card>
        );
    }

    const renderReviews = (data, key) => {
        return (
            <div key={key} className='p-m-4'>
                <div className='p-d-flex p-ai-center'>
                    <Avatar shape="circle" image={data.user.photo} size="xlarge" />
                    <div className='p-ml-3'>
                        <div>
                            <b>{data.user.first_name} {data.user.last_name}</b>
                        </div>
                        <Rating value={data.rating} readOnly stars={5} cancel={false} className='p-mt-2' />
                    </div>
                </div>
                <hr style={{ width: '50%', marginLeft: '0' }}></hr>
                <p style={{ whiteSpace: 'pre-wrap' }}>{data.text}</p>
            </div>
        )
    }

    return (
        <>
            <div style={{ width: '50%', margin: 'auto' }} className='p-mt-6 p-mb-4'>
                <div className='p-d-flex p-ai-center'>
                    <Avatar shape="circle" image={designer?.photo} size="xlarge" />
                    <div className='p-ml-3'>
                        <div>
                            <b>{designer?.first_name} {designer?.last_name}</b>
                        </div>
                        <Rating value={designer?.rating} readOnly stars={5} cancel={false} className='p-mt-2' />
                    </div>
                </div>
                <div className='p-d-flex p-ai-center p-mt-2'>
                    <span className='p-mr-3'>
                        <h3>Занят:</h3>
                    </span>
                    <InputSwitch checked={designer?.engaged} onChange={updateEngaged} />
                    {/* <Calendar value={date} onChange={({ value }) => setDate(value)} inline showWeek /> */}
                </div>
                <div>
                    <h3>О себе:</h3>
                    {edit ?
                        <div style={{ width: '100%', height: '300px' }}>
                            <Quill
                                text={designerUpdated?.bio}
                                setText={(e) => setDesigner({ bio: e })}
                            ></Quill>
                        </div>
                        :
                        <div dangerouslySetInnerHTML={{ __html: designer?.bio }} />
                    }
                </div>
                <div className='p-m-3' style={{ textAlign: 'center' }}>
                    {!edit && <Button label='Редактировать' icon='pi pi-pencil' onClick={() => setEdit(!edit)} />}
                    {edit &&
                        <>
                            <Button label='Отменить' className='p-mr-3' disabled={!edit} onClick={() => setEdit(!edit)} />
                            <Button label='Сохранить' onClick={() => update(designerUpdated)} />
                        </>
                    }
                </div>
            </div>
            <div style={{ textAlign: 'center', width: '80%', margin: 'auto' }}>
                <h3>Работы:</h3>
                {admin &&
                    <Button>
                        <Link href={`${process.env.NEXT_PUBLIC_SELF_URL}/admin/portfolios/create?designer_id=${designer?.id}`}>Добавить</Link>
                    </Button>
                }
                {designer?.previews?.length > 0 ?
                    (<div
                        style={{ display: 'flex', flexWrap: 'wrap' }}
                    >
                        {designer?.previews?.map((el, i) => renderCard(el, i))}
                    </div>)
                    :
                    <p style={{ textAlign: 'center' }}>У этого дизайнера пока нет работ</p>
                }
            </div>
            <div style={{ textAlign: 'center', width: '80%', margin: 'auto' }}>
                <h3>Предложения:</h3>
                {admin &&
                    <Button>
                        <Link href={`${process.env.NEXT_PUBLIC_SELF_URL}/admin/portfolios/create?designer_id=${designer?.id}`}>Добавить</Link>
                    </Button>
                }
                {designer?.offers?.length > 0 ?
                    (<div
                        style={{ display: 'flex', flexWrap: 'wrap' }}
                    >
                        {designer?.offers?.map((el, i) => renderOfferCard(el, i))}
                    </div>)
                    :
                    <p style={{ textAlign: 'center' }}>У этого дизайнера пока нет работ</p>
                }
            </div>
            <div style={{ width: '70%', margin: 'auto' }}>
                <h3 style={{ textAlign: 'center' }}>Отзывы:</h3>
                <div>
                    {designer?.reviews?.length > 0 ?
                        designer?.reviews?.map((el, i) => renderReviews(el, i))
                        :
                        <p style={{ textAlign: 'center' }}>У этого дизайнера пока нет отзывов</p>
                    }
                </div>
            </div>
        </>
    )
}

export default DesignerCard;