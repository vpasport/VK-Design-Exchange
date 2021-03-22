import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Avatar } from 'primereact/avatar';
import { Rating } from 'primereact/rating';
import { Button } from 'primereact/button';
import Link from 'next/link';

const DesignersTable = ({ designers, deleteDesigner }) => {

    const photo = (designer) => {
        return (
            <div className="p-multiselect-representative-option">
                <Avatar shape="circle" image={designer.photo} size='xlarge'/>
                {/* <img alt='Аватар' src={designer.photo !== null && designer.photo} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} width="32" style={{verticalAlign: 'middle'}} /> */}
            </div>
        );
    }

    const rating = (designer) => {
        return (
            <div className="p-multiselect-representative-option">
                <Rating value={designer.rating} readOnly stars={5} cancel={false} className='p-mt-2' />
                <span style={{ verticalAlign: 'middle', marginLeft: '.5em' }}>{designer.rating}</span>
            </div>
        )
    }

    const buttons = (designer) => {
        return (
            <div style={{display: 'inline-block'}}>
                <Button>
                    <Link href={`${process.env.NEXT_PUBLIC_SELF_URL}/admin/designers/${designer.id}`}>Редактировать</Link>
                </Button>
                <Button className='p-ml-2 p-button-danger' label='Удалить' onClick={() => deleteDesigner(designer.id)}/>
            </div>
        )
    }

    return (
        <>
            <div className="card">
                <DataTable
                    value={designers}
                    className="p-datatable-customers"
                    dataKey="id"
                    rowHover
                    paginator
                    rows={8}
                    emptyMessage="No customers found"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10, 25, 50]}>
                    <Column field="vk_id" headerStyle={{ width: '10%', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} header="VK" sortable filter filterPlaceholder="Search" />
                    <Column field='photo' headerStyle={{ width: '10%', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} header="Фото" body={photo} />
                    <Column field='first_name' header='Имя' sortable filter filterPlaceholder="Search" />
                    <Column field='last_name' header='Фамилия' sortable filter filterPlaceholder="Search" />
                    <Column field="rating" header="Рейтинг" body={rating} />
                    <Column header='Управление' body={buttons} headerStyle={{ width: '30%', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} />
                </DataTable>
            </div>
        </>
    )
}

export default DesignersTable;