import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import Link from 'next/link';
import { DataView } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

const Offers = ({ user }) => {
    const router = useRouter();
    const route = router.route;

    const [offers, setOffers] = useState(null);

    const [totalRecords, setTotalRecords] = useState(0);
    const [rows, setRows] = useState(9);
    const [first, setFirst] = useState(0);

    const getOffers = async (from, to) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${route === '/admin/offers' ? 'offers/' : `designers/${user.db.did}/offers/`}?from=${from}&to=${to}`);
        const { offers, count } = await response.json();

        for (let i = offers.length; i < rows; i++) {
            offers.push({});
        }

        setFirst(from);
        setOffers(offers);
        setTotalRecords(count);
    }

    useEffect(() => {
        getOffers(0, 9);
    }, []);

    const renderGridItem = (data) => {
        const footer = (
            <div className='p-d-flex p-ai-center p-jc-between p-pl-1 p-pr-1'>
                <h3>Стоимость: {data.price}₽</h3>
                <Button>
                    {user.mainRole === 'admin' && <Link href={`${process.env.NEXT_PUBLIC_SELF_URL}/admin/offers/${data.id}`}>Обзор</Link>}
                    {user.mainRole === 'designer' && <Link href={`${process.env.NEXT_PUBLIC_SELF_URL}/designer/offers/${data.id}`}>Обзор</Link>}
                </Button>
            </div>
        );

        const header = (
            <img
                style={{ maxHeight: '250px' }}
                alt={data.title}
                src={`${process.env.NEXT_PUBLIC_API_URL}/${data.preview}`}
                onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'}
            />
        );

        if (data.title === undefined) return (
            <></>
        )

        return (
            <Card
                className='p-m-2'
                style={{ width: 'calc(100%/3 - 1em)' }}
                title={data.title}
                footer={footer}
                header={header}
            />
        );
    }

    const itemTemplate = (product) => {
        if (!product) {
            return;
        }

        return renderGridItem(product);
    }

    const header = () => {
        return (
            <div style={{ textAlign: 'center' }}>
                <h3>Список моих предложений</h3>
            </div>
        );
    }

    const onPage = (event) => {
        getPreviews(event.first, event.rows + event.first)
    }

    return (
        <div className="p-d-flex p-jc-center">
            <DataView
                header={header()}
                className='p-mt-4'
                value={offers}
                layout='grid'
                itemTemplate={itemTemplate}
                paginator
                lazy
                onPage={onPage}
                rows={rows}
                totalRecords={totalRecords}
                first={first}
            />
        </div>
    )
}

export { Offers };