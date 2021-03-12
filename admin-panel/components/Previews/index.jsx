import { DataView } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import Link from 'next/link';

const Previews = ({ previews }) => {

    const renderGridItem = (data) => {
        const footer = (
            <span>
                <Button>
                    <Link href={`${process.env.NEXT_PUBLIC_SELF_URL}/admin/portfolios/${data.id}`}>Редактировать</Link>
                </Button>
            </span>
        );

        const header = (
            <img alt={data.description} src={`${process.env.NEXT_PUBLIC_API_URL}/${data.preview}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} />
        );

        return (
            <Card
                className='p-m-2'
                style={{ width: 'calc(100%/3 - 1em)' }}
                title={data.description}
                footer={footer}
                header={header}
            >
                <p className="p-m-0" style={{ lineHeight: '1.5' }}>{data.title}</p>
            </Card>
        );
    }

    const itemTemplate = (product) => {
        if (!product) {
            return;
        }

        return renderGridItem(product);
    }

    return (
        <div className="p-d-flex p-jc-center">
            <DataView
                className='p-mt-6'
                value={previews}
                layout='grid'
                itemTemplate={itemTemplate}
                paginator 
                rows={9}
            />
        </div>
    )
}

export default Previews;