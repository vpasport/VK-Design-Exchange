import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Avatar } from 'primereact/avatar';
import { Dialog } from 'primereact/dialog';
import { useState } from 'react';

const AdminTable = ({ admins, deleteAdmin }) => {
    const [adminId, setAdminId] = useState(null);

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
                <Button className='p-ml-2 p-button-danger' label='Удалить' onClick={() => setAdminId(admin.id)} />
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
                rows={admins.length}
                emptyMessage="No customers found"
                >
                <Column field="vk_id" headerStyle={{ width: '10%', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} header="VK" sortable filter filterPlaceholder="Search" />
                <Column field='photo' headerStyle={{ width: '10%', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} header="Фото" body={photo} />
                <Column field='first_name' header='Имя' sortable filter filterPlaceholder="Search" />
                <Column field='last_name' header='Фамилия' sortable filter filterPlaceholder="Search" />
                {admins?.length > 1 &&
                    <Column header='Управление' body={buttons} headerStyle={{ width: '30%', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} />

                }
            </DataTable>
            <Dialog
                header='Внимание!'
                visible={!(adminId === null)}
                style={{ with: '50vw' }}
                onHide={() => setAdminId(null)}
            >
                Вы уверены, что хотите удалить администратора?
                <br />
                <div className='p-mt-4'>
                    <Button
                        label='Да'
                        onClick={() => {
                            deleteAdmin(adminId);
                            setAdminId(null);
                        }}
                    />
                    <Button
                        className='p-ml-4'
                        label='Отмена'
                        onClick={() => setAdminId(null)}
                    />
                </div>
            </Dialog>
        </div>
    )
}

export default AdminTable;