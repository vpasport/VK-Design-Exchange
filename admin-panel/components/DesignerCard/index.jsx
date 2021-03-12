import { Avatar } from 'primereact/avatar';
import { Rating } from 'primereact/rating';
import { Card } from 'primereact/card';

const DesignerCard = ({ designer, edit }) => {
    return (
        <>
            <div style={{ width: '40vw', margin: 'auto' }} className='p-mt-6'>
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
                    {/* <Card
                        className='p-m-2'
                        style={{ width: 'calc(100%/3 - 1em)' }}
                        title={data.description}
                        footer={footer}
                        header={header}
                    >
                        <p className="p-m-0" style={{ lineHeight: '1.5' }}>{data.title}</p>
                    </Card> */}
                </div>
            </div>
        </>
    )
}

export default DesignerCard;