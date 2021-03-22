import { Avatar } from 'primereact/avatar';
import { Rating } from 'primereact/rating';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import Link from 'next/link';
import { InputText } from "primereact/inputtext";
import { InputTextarea } from 'primereact/inputtextarea';
import { useEffect, useState } from 'react';

const DesignerCard = ({ designer, edit, update }) => {
    const [designerUpdated, setDesignerUpdated] = useState(designer);

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
                    <Link href={`${process.env.NEXT_PUBLIC_SELF_URL}/admin/portfolios/${data?.id}`}>Обзор</Link>
                </Button>
            </span>
        );

        const header = (
            <img alt={data.description} src={`${process.env.NEXT_PUBLIC_API_URL}/${data?.preview}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} />
        );

        return (
            <Card
                key={key}
                className='p-m-2'
                style={{ width: '48%' }}
                title={data.description}
                footer={footer}
                header={header}
            >
                <p className="p-m-0" style={{ lineHeight: '1.5' }}>{data.title}</p>
            </Card>
        );
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
                {/* <div>
                    <h3>Опыт:</h3>
                    {edit ?
                        <div className='p-inputgroup p-m-1'>
                            <InputText
                                placeholder={'Опыт (в годах)'}
                                type='number'
                                value={designerUpdated?.experience}
                                onChange={({ target: { value: experience } }) => setDesigner({experience})}
                            />
                        </div>
                        :
                        <p>{designer?.experience} года</p>
                    }
                </div> */}
                <div>
                    <h3>О себе:</h3>
                    {edit ?
                        <div className='p-inputgroup p-m-1'>
                            <InputTextarea
                                placeholder={'Осебе'}
                                value={designerUpdated?.bio}
                                style={{ height: '10vh' }}
                                onChange={({ target: { value: bio } }) => setDesigner({ bio })}
                            />
                        </div>
                        :
                        <p style={{ whiteSpace: 'pre-wrap' }}>{designer?.bio}</p>
                    }
                </div>
                <div className='p-m-3' style={{ textAlign: 'center' }}>
                    {edit && <Button label='Сохранить' onClick={() => update(designerUpdated)} />}
                </div>
                <div style={{ textAlign: 'center' }}>
                    <h3>Работы:</h3>
                    <Button>
                        <Link href={`${process.env.NEXT_PUBLIC_SELF_URL}/admin/portfolios/create?designer_id=${designer?.id}`}>Добавить</Link>
                    </Button>
                    <div>
                        {designer?.previews.map((el, i) => renderCard(el, i))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default DesignerCard;