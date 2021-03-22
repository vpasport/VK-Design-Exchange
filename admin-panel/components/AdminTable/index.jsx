import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Avatar } from 'primereact/avatar';

const AdminTable = ({ admins, deleteAdmin }) => {
    const photo = (admin) => {
        return (
            <div className="p-multiselect-representative-option">
                <Avatar shape="circle" image={admin.photo} size='xlarge' />
            </div>
        );
    }

    const buttons = (admin) => {
        return (
            <div style={{ display: 'inline-block' }}>
                <Button className='p-ml-2 p-button-danger' label='Удалить' onClick={() => deleteAdmin(admin.id)} />
            </div>
        )
    }

    return (
        <div className="card p-m-6">
            <DataTable
                value={admins}
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
                <Column header='Управление' body={buttons} headerStyle={{ width: '30%', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} />
            </DataTable>
        </div>
    )
}

export default AdminTable;