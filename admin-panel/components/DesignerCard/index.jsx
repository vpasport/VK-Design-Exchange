import { Avatar } from 'primereact/avatar';
import { Rating } from 'primereact/rating';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import Link from 'next/link';

const DesignerCard = ({ designer, edit }) => {

    const renderCard = (data) => {
        const footer = (
            <span>
                <Button>
                    <Link href={`${process.env.NEXT_PUBLIC_SELF_URL}/admin/portfolios/${data.id}`}>Обзор</Link>
                </Button>
                <Button label='Удалить' className='p-button-danger p-ml-2' />
            </span>
        );

        const header = (
            <img alt={data.description} src={`${process.env.NEXT_PUBLIC_API_URL}/${data.preview}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} />
        );

        return (
            <Card
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
                <div>
                    <h3>Опыт:</h3>
                    <p>{designer?.experience} года</p>
                </div>
                <div>
                    <h3>Специализация:</h3>
                    <p>{designer?.specialization}</p>
                </div>
                <div>
                    <h3>Работы:</h3>
                </div>
            </div>
            <div>
                {designer?.previews.map(el => renderCard(el))}
            </div>
        </>
    )
}

export default DesignerCard;