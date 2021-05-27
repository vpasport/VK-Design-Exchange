import { DataView } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Previews = ({ user }) => {
    const router = useRouter();
    const route = router.route;

    const [previews, setPreviews] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [rows, setRows] = useState(9);
    const [first, setFirst] = useState(0);

    const getPreviews = async (from, to) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${route === '/admin/portfolios' ? 'portfolio/previews/' : `designers/${user.db.did}/previews/`}?from=${from}&to=${to}`);

        const { previews, count } = await res.json();

        for (let i = previews.length; i < rows; i++) {
            previews.push({})
        }

        setFirst(from);
        setPreviews(previews);
        setTotalRecords(count);
    }

    useEffect(() => {
        getPreviews(0, 9);
    }, [])

    const renderGridItem = (data) => {
        const footer = (
            <span>
                <Button>
                    {user.mainRole === 'admin' && <Link href={`${process.env.NEXT_PUBLIC_SELF_URL}/admin/portfolios/${data.id}`}>Обзор</Link>}
                    {user.mainRole === 'designer' && <Link href={`${process.env.NEXT_PUBLIC_SELF_URL}/designer/portfolio/${data.id}`}>Обзор</Link>}
                </Button>
            </span>
        );

        const header = (
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    paddingBottom: '100%',
                }
                }
            >
                <img
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'top',
                    }}
                    alt={data.title}
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${data.preview}`}
                    onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'}
                />
            </div >
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
                <h3>Список работ</h3>
            </div>
        );
    }

    const onPage = (event) => {
        getPreviews(event.first, event.rows + event.first)
    }

    return (
        <div
            style={{
                width: '90%',
                margin: 'auto'
            }}
        >
            <DataView
                header={header()}
                className='p-mt-4'
                value={previews}
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

export default Previews;