import Link from 'next/link';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Avatar } from "primereact/avatar";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';

const OrdersList = ({ user }) => {
    const router = useRouter();
    const route = router.route;

    const [orders, setOrders] = useState(null);

    const [count, setCount] = useState(0);
    const [rows, setRows] = useState(20);
    const [first, setFirst] = useState(0);

    const [warning, setWarning] = useState(false);
    const [id, setId] = useState(null);

    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState('');

    const [cancle, setCancele] = useState(false);
    const [comment, setComment] = useState('');
    const [commentError, setCommnetError] = useState(null);

    const [finish, setFinish] = useState(false);

    const getOrders = async (from, to) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${route === '/admin/orders' ? 'orders/' : `designers/${user.db.did}/orders/`}?from=${from}&to=${to}`, {
            credentials: 'include'
        })
        const { orders, count } = await response.json();

        console.log(orders, count)
        setFirst(from);
        setCount(count);
        setOrders(orders);
    }


    useEffect(() => {
        getOrders(first, rows);
    }, []);

    const header = () => {
        return (
            <div style={{ textAlign: 'center' }}>
                <h3>Список моих предложений</h3>
            </div>
        );
    }

    const onPage = (event) => {
        getOrders(event.first, event.first + event.rows);
    }

    const offer = (data) => {
        return (
            <Link href={`/designer/offers/${data.offer_id}`}>{data.title}</Link>
        )
    }

    const customer = (data) => {
        return (
            <a
                style={{ display: 'flex' }}
                href={`https://vk.com/id${data.customer.id}`}
            >
                <Avatar shape="circle" image={data.customer.photo_max} size='xlarge' />
                <p className='p-ml-3'>{data.customer.first_name} {data.customer.last_name}</p>
            </a>
        )
    }

    const statuses = (data) => {
        let lable = '';
        let but = true;

        switch (data.status_id) {
            case 2: lable = 'Принять'; break;
            case 3: lable = 'Отправить на проверку'; break;
            default: but = false; break;
        }

        return (
            <div style={{ display: 'inline-block' }}>
                {but &&
                    < Button
                        className='p-mr-2'
                        label={lable}
                        onClick={() => {
                            setId(data.id);
                            setWarning(true);
                        }}
                    />
                }
                {(user.mainRole && data.status_id === 4) &&
                    < Button
                        className='p-mr-2'
                        label='Завершить заказа'
                        onClick={() => {
                            setId(data.id);
                            setFinish(true);
                        }}
                    />
                }
                {(data.status_id !== 1 && data.status_id !== 5) &&
                    <Button
                        className='p-button-danger'
                        label='Отменить заказ'
                        onClick={() => {
                            setId(data.id);
                            setCancele(true);
                        }}
                    />
                }
                {(data.status_id === 1 || data.status_id === 5) &&
                    <Link
                        href={`${route === '/admin/orders' ? `/admin/orders/${data.id}` : `/designer/orders/${data.id}`}`}
                    >
                        <Button
                            label='Просмотр'
                            className='p-button-secondary'
                        />
                    </Link>
                }
            </div>
        )
    }

    const cancelOrder = async (id) => {
        setCommnetError(null);
        if (comment.length < 1) {
            setCommnetError('Напишите причину отзака');
            return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}/cancel`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                comment
            })
        })

        if (response.ok) {
            getOrders(first, first + rows)
            setCancele(false);
            return;
        }

        setErrorText('Что-то пошло не так');
        setError(true);
    }

    const updateStatus = async (id) => {
        setErrorText('');

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
            method: 'PUT',
            credentials: 'include'
        })

        if (response.ok) {
            getOrders(first, first + rows)
            setWarning(false);
            return;
        }

        setErrorText('Что-то пошло не так');
        setError(true);
    }

    const finishOrder = async (id) => {
        setErrorText('');

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}/finish`, {
            method: 'PUT',
            credentials: 'include'
        })

        if (response.ok) {
            getOrders(first, first + rows)
            setFinish(false);
            return;
        }

        setErrorText('Что-то пошло не так');
        setError(true);
    }

    return (
        <>
            <DataTable
                className='p-mt-4'
                value={orders}
                paginator lazy
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                header={header()}
                first={first}
                rows={rows}
                onPage={onPage}
                totalRecords={count}
            >
                <Column header="Заказ" body={offer}></Column>
                <Column header="Заказчик" body={customer}></Column>
                <Column field="status" header="Статус"></Column>
                <Column header='Обновление статуса' bodyStyle={{ textAlign: 'center' }} headerStyle={{ width: '30%', textAlign: 'center' }} body={statuses}></Column>
            </DataTable>
            <Dialog
                header='Внимание!'
                visible={warning}
                style={{ width: '50vw' }}
                onHide={() => setWarning(false)}
            >
                Ты уверен?
                <br />
                <Button
                    className='p-mt-4'
                    label='Да!'
                    onClick={() => updateStatus(id)}
                />
            </Dialog>
            <Dialog
                header='Внимание!'
                visible={finish}
                style={{ width: '50vw' }}
                onHide={() => setFinish(false)}
            >
                Ты уверен? После подтверждения нельзя будет отменить эти изменения или отменить заказ
                <br />
                <Button
                    className='p-mt-4'
                    label='Да!'
                    onClick={() => finishOrder(id)}
                />
            </Dialog>
            <Dialog
                header='Ошибка!'
                visible={error}
                style={{ width: '50vw' }}
                onHide={() => setError(false)}
            >
                {errorText}
            </Dialog>
            <Dialog
                header='Отмена заказа'
                visible={cancle}
                style={{ width: '50vw' }}
                onHide={() => setCancele(false)}
            >
                Причина:
                <br />
                <p className='p-mt-4' style={{ color: 'red' }}>{commentError}</p>
                <InputTextarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{ width: '100%', height: '200px' }}
                    autoResize
                />
                <br />
                <Button
                    className='p-mt-4'
                    label='Принять'
                    onClick={() => cancelOrder(id)}
                />
            </Dialog>
        </>
    )
}

export default OrdersList;