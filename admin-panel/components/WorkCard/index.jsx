import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Rating } from 'primereact/rating';

const WorkCard = ({ work }) => {
    console.log(work)
    return (
        <>
            <div style={{ width: '40vw', margin: 'auto' }} className='p-mt-6'>
                <div className='p-d-flex p-ai-center'>
                    <Avatar shape="circle" image={work?.author?.photo} size="xlarge" />
                    <div className='p-ml-3'>
                        <div>
                            <b>{work?.author?.first_name} {work?.author?.last_name}</b>
                        </div>
                        <Rating value={work?.author?.rating} readOnly stars={5} cancel={false} className='p-mt-2' />
                    </div>
                </div>
                <div className='p-mt-3'>
                    {work?.tags.map((el, i) => (
                        <Button key={i} label={el.name} className="p-button-outlined p-button-rounded p-mr-2" />
                    ))}
                </div>
                <div>
                    <h3>Название:</h3>
                    <p><b>{work?.title}.</b> {work?.description}</p>
                </div>
            </div>
            <div style={{ textAlign: 'center' }} className='p-mt-6 p-mb-6'>
                <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${work?.preview}`}
                    style={{ width: '50%' }}>

                </img>
            </div>
            <div style={{ width: '40vw', margin: 'auto' }}>
                <div>
                    <h3>Описание проекта:</h3>
                    <p>{work?.project_description}</p>
                </div>
                <div>
                    <h3>Описание задачи:</h3>
                    <p>{work?.task_description}</p>
                </div>
                <div>
                    <h3>Выполненная работа:</h3>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{work?.completed_work}</p>
                </div>
            </div>
            <div style={{ textAlign: 'center' }} className='p-mt-6 p-mb-6'>
                <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${work?.work_image}`}
                    style={{ width: '100%' }}>

                </img>
            </div>
        </>
    )
}

export default WorkCard;