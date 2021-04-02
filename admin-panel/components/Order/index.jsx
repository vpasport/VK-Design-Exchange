import { Avatar } from "primereact/avatar";

const Order = ({ order }) => {
    console.log(order)

    const renderComment = (el, key) => {
        let user;

        if (el.from_vk_id === order.customer.id) user = order.customer;
        if (el.from_vk_id === order.designer.id) user = order.designer;
        return (
            <div key={key} className='p-m-4'>
                <div className='p-d-flex p-ai-center'>
                    <Avatar shape="circle" image={user.photo_max} size="xlarge" />
                    <div className='p-ml-3'>
                        <div>
                            <b>{user.first_name} {user.last_name}</b>
                        </div>
                    </div>
                </div>
                <hr style={{ width: '50%', marginLeft: '0' }}></hr>
                <p style={{ whiteSpace: 'pre-wrap' }}>{el.comment}</p>
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
                <div>
                    <h3>Статус:</h3>
                    <p><b>{order?.status}</b></p>
                </div>
            </div>
            <div style={{ width: '50%', margin: 'auto' }}>
                <div>
                    <h3>Название:</h3>
                    <p><b>{order?.offer?.title}</b></p>
                </div>
                <div>
                    <h3>Стоимость:</h3>
                    <p><b>{order?.offer?.price} ₽</b></p>
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
            </div>
        </>
    )
}

export default Order;