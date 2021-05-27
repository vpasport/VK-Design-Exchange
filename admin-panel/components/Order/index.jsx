import { useRef, useState } from 'react';
import { Avatar } from "primereact/avatar";
import { Galleria } from "primereact/galleria";
import { Rating } from "primereact/rating";

const Order = ({ order }) => {
    const galleria = useRef();

    const [activeIndex, setActiveIndex] = useState(0);

    const responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 5
        },
        {
            breakpoint: '768px',
            numVisible: 3
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];

    console.log(order)

    const itemTemplate = (item) => {
        return <img src={`${process.env.NEXT_PUBLIC_API_URL}/${item}`} alt='Отзыв' style={{ width: '100%', display: 'block' }} />;
    }

    const renderComment = (el, key) => {
        let user;

        if (el.from_vk_id === order.customer.id) user = order.customer;
        else if (el.from_vk_id === order.designer.id) user = order.designer;
        else user = order.commentators.find(el1 => el.from_vk_id === el1.id)

        console.log(user);

        return (
            <div key={key} className='p-m-4'>
                <div className='p-d-flex p-ai-center'>
                    <Avatar shape="circle" image={user?.photo_max} size="xlarge" />
                    <div className='p-ml-3'>
                        <div>
                            <b>{user?.first_name} {user?.last_name}</b>
                        </div>
                    </div>
                </div>
                <hr style={{ width: '50%', marginLeft: '0' }}></hr>
                <p style={{ whiteSpace: 'pre-wrap' }}>{el.comment}</p>
            </div>
        )
    }

    const renderReview = (data) => {
        return (
            <div className='p-m-4'>
                <div className='p-d-flex p-ai-center'>
                    <Avatar shape="circle" image={order.customer.photo_max} size="xlarge" />
                    <div className='p-ml-3'>
                        <div>
                            <b>{order.customer.first_name} {order.customer.last_name}</b>
                        </div>
                        <Rating value={data.rating} readOnly stars={5} cancel={false} className='p-mt-2' />
                    </div>
                </div>
                <hr style={{ width: '50%', marginLeft: '0' }}></hr>
                <Galleria
                    ref={galleria}
                    value={[data?.image]}
                    responsiveOptions={responsiveOptions}
                    numVisible={7}
                    style={{ maxWidth: '850px' }}
                    activeIndex={activeIndex}
                    onItemChange={(e) => setActiveIndex(e.index)}
                    circular
                    fullScreen
                    showThumbnails={false}
                    item={itemTemplate}
                    baseZIndex={1000}
                />
                <div className="p-grid" style={{ maxWidth: '400px' }}>
                    {data?.image &&
                        <div className="p-col-3">
                            <img
                                src={`${process.env.NEXT_PUBLIC_API_URL}/${data?.image}`}
                                alt='Отзыв'
                                style={{ cursor: 'pointer', maxWidth: '200px' }}
                                onClick={() => {
                                    galleria.current.show();
                                }} />
                        </div>

                    }
                </div>
                <p style={{ whiteSpace: 'pre-wrap' }}>{data.text}</p>
            </div>
        )
    }

    return (
        <>
            <div style={{ width: '60%', margin: 'auto' }}>
                <h1>Карточка заказа:</h1>
            </div>
            <div style={{ textAlign: 'center' }} className='p-mt-6 p-mb-6'>
                <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${order?.offer?.preview}`}
                    style={{ maxHeight: '250px' }}>
                </img>
            </div>
            <div style={{ width: '50%', margin: 'auto' }}>
                <div className='p-d-flex p-ai-center'>
                    <h3>Статус:</h3>
                    <p className='p-ml-2'><b>{order?.status}</b></p>
                </div>
            </div>
            <div style={{ width: '50%', margin: 'auto' }}>
                <div className='p-d-flex p-ai-center'>
                    <h3>Название:</h3>
                    <p className='p-ml-2'><b>{order?.offer?.title}</b></p>
                </div>
                <div>
                    <p>Дата создания заказа: {new Date((order?.create_date + new Date().getTimezoneOffset() * 60) * 1000).toLocaleDateString("ru-RU", {
                        year: 'numeric', month: 'numeric', day: 'numeric',
                        hour: 'numeric', minute: 'numeric', hour12: false
                    })}</p>
                    <p>Дата последнего изменения статуса заказа: {new Date((order?.update_date + new Date().getTimezoneOffset() * 60) * 1000).toLocaleDateString("ru-RU", {
                        year: 'numeric', month: 'numeric', day: 'numeric',
                        hour: 'numeric', minute: 'numeric', hour12: false
                    })}</p>
                </div>
                <div className='p-d-flex p-ai-center'>
                    <h3>Стоимость:</h3>
                    <p className='p-ml-2'><b>{order?.offer?.price} ₽</b></p>
                </div>
                <div>
                    <h3>Описание:</h3>
                    <div dangerouslySetInnerHTML={{ __html: order?.offer?.description }} />
                </div>
                {order?.comments !== undefined &&
                    <div>
                        <h3>Комментарии:</h3>
                        {order?.comments?.map((el, i) => renderComment(el, i))}
                    </div>
                }
                {order?.review !== undefined &&
                    <div>
                        <h3>Отзыв:</h3>
                        {renderReview(order?.review)}
                    </div>
                }
            </div>
        </>
    )
}

export default Order;