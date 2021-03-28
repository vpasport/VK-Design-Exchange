import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import Link from 'next/link';

const AllOffers = ({ user }) => {
    const router = useRouter();
    const route = router.route;

    const [offers, setOffers] = useState(null);

    const [count, setCount] = useState(0);
    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);

    const getOffers = async (from, to) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${route === '/admin/offers' ? 'offers/' : `designers/${user.db.did}/offers/`}?from=${from}&to=${to}`, {
            credentials: 'include'
        });
        const { offers, count } = await response.json();

        setFirst(from);
        setOffers(offers);
        setCount(count);
    }

    useEffect(() => {
        getOffers(0, 10);
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
                <Button className='p-ml-2 p-button-danger' label='Удалить' onClick={() => deleteDesigner(offer.id)} />
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
    )
}

export { AllOffers };