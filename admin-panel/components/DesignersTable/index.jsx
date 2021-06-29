import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Avatar } from 'primereact/avatar';
import { Rating } from 'primereact/rating';
import { Button } from 'primereact/button';
import Link from 'next/link';
import { useState } from 'react';
import { Dialog } from 'primereact/dialog';

const DesignersTable = ({
    designers, deleteDesigner,
    createProfile
}) => {
    const [deleteId, setDeleteId] = useState(null);

    const photo = (designer) => {
        return (
            <div className="p-multiselect-representative-option">
                <Avatar shape="circle" image={designer.photo} size='xlarge' />
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
            <div style={{ display: 'inline-block' }}>
                <Button>
                    <Link href={`${process.env.NEXT_PUBLIC_SELF_URL}/admin/designers/${designer.id}`}>Редактировать</Link>
                </Button>
                <Button className='p-ml-2 p-button-danger' label='Удалить' onClick={() => setDeleteId(designer.id)} />
            </div>
        )
    }

    const header = () => {
        return (
            <div className='p-d-flex p-jc-between' style={{ textAlign: 'center' }}>
                <h3>Список дизайнеров</h3>
                <span>
                    <Button
                        label='Добавить'
                        icon='pi pi-plus'
                        className='p-ml-2'
                        onClick={() => createProfile()}
                    />
                </span>
            </div>
        );
    }

    return (
        <>
            <div className="card">
                <DataTable
                    header={header()}
                    value={designers}
                    className="p-datatable-customers"
                    dataKey="id"
                    rowHover
                    paginator
                    rows={8}
                    emptyMessage="No customers found"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10, 25, 50]}>
                    <Column field="vk_id" headerStyle={{ width: '10%', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} header="VK" sortable filter filterPlaceholder="Поиск" />
                    <Column field='photo' headerStyle={{ width: '10%', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} header="Фото" body={photo} />
                    <Column field='first_name' header='Имя' sortable filter filterPlaceholder="Поиск" />
                    <Column field='last_name' header='Фамилия' sortable filter filterPlaceholder="Поиск" />
                    <Column field="rating" header="Рейтинг" body={rating} />
                    <Column header='Управление' body={buttons} headerStyle={{ width: '30%', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} />
                </DataTable>
            </div>
            <Dialog
                header='Внимание!'
                visible={!(deleteId === null)}
                style={{ with: '50vw' }}
                onHide={() => setDeleteId(null)}
            >
                Вы уверены, что хотите удалить дизайнера?
                <br />
                <div className='p-mt-4'>
                    <Button
                        label='Да'
                        onClick={() => {
                            deleteDesigner(deleteId);
                            setDeleteId(null);
                        }}
                    />
                    <Button
                        className='p-ml-4'
                        label='Отмена'
                        onClick={() => setDeleteId(null)}
                    />
                </div>
            </Dialog>
        </>
    )
}

export default DesignersTable;