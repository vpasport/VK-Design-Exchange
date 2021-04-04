import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import Link from 'next/link';
import { Dialog } from 'primereact/dialog';

const AllOffers = ({ user }) => {
    const router = useRouter();
    const route = router.route;

    const [offers, setOffers] = useState(null);

    const [count, setCount] = useState(0);
    const [rows, setRows] = useState(20);
    const [first, setFirst] = useState(0);

    const [offerId, setOfferId] = useState(null);

    const [errorText, setErrorText] = useState(null);

    const getOffers = async (from, to) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${route === '/admin/offers' ? 'offers/' : `designers/${user.db.did}/offers/`}?from=${from}&to=${to}`, {
            credentials: 'include'
        });
        const { offers, count } = await response.json();

        setFirst(from);
        setOffers(offers);
        setCount(count);
    }

    const deleteOffer = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offers/`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: offerId
            })
        })

        if (response.ok) {
            getOffers(first, first + rows);
            setOfferId(null);
            return;
        }

        setErrorText('Что-то пошло не так')
    }

    useEffect(() => {
        getOffers(first, first + rows);
    }, [])

    const imageBodyTemplate = (rowData) => {
        return <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/${rowData.preview}`}
            onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'}
            alt={rowData.title}
            className="product-image"
            style={{ width: '170px', maxHeight: '106px' }}
        />
    }

    const buttons = (offer) => {
        return (
            <div style={{ display: 'inline-block' }}>
                <Button>
                    <Link href={`${process.env.NEXT_PUBLIC_SELF_URL}/admin/offers/${offer.id}`}>Редактировать</Link>
                </Button>
                <Button className='p-ml-2 p-button-danger' label='Удалить' onClick={() => setOfferId(offer.id)} />
            </div>
        )
    }

    const header = () => {
        return (
            <div style={{ textAlign: 'center' }}>
                <h3>Список предложений</h3>
            </div>
        );
    }

    const onPage = (event) => {
        getOffers(event.first, event.rows + event.first)
    }

    return (
        <>
            <DataTable
                header={header()}
                value={offers}
                paginator lazy
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                rows={rows}
                onPage={onPage}
                totalRecords={count}
                first={first}
                className='p-mt-4'
            >
                <Column field='id' header='ID' style={{ width: '40px' }}></Column>
                <Column header="Image" body={imageBodyTemplate}></Column>
                <Column field='title' header='Название'></Column>
                <Column field='price' header='Стоимость'></Column>
                <Column header='Управление' body={buttons} headerStyle={{ width: '30%', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} />
            </DataTable>
            <Dialog
                header='Внимание!'
                visible={!(offerId === null)}
                style={{ with: '50vw' }}
                onHide={() => setOfferId(null)}
            >
                Вы уверены, что хотите удалить предложение?
            <br />
                <div className='p-mt-4'>
                    <Button
                        label='Да'
                        onClick={deleteOffer}
                    />
                    <Button
                        className='p-ml-4'
                        label='Отмена'
                        onClick={() => setOfferId(null)}
                    />
                </div>
            </Dialog>
            <Dialog
                header='Ошибка!'
                visible={!errorText === null}
                style={{ width: '50vw' }}
                onHide={() => setErrorText(null)}
            >
                {errorText}
            </Dialog>
        </>
    )
}

export { AllOffers };