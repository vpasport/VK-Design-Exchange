import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Avatar } from 'primereact/avatar';
import { Dialog } from 'primereact/dialog';

const BannedTable = ({ }) => {
    const [users, setUsers] = useState(null);
    const [userId, setUserId] = useState(null);

    const [dialog, setDialog] = useState(false);
    const [error, setError] = useState('');

    const getUsers = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/banned`, {
            credentials: 'include'
        })

        const { users } = await response.json();

        setUsers(users);
    }

    const unbanUser = async (id) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/unban`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id
            })
        })

        if (!response.ok) {
            setError('Не удалось разбанить пользователя');
            setDialog(true);
            return;
        }

        await getUsers();
    }

    useEffect(() => {
        getUsers();
    }, []);

    console.log(users);

    const header = () => {
        return (
            <div style={{ textAlign: 'center' }}>
                <h3>Список забаненных</h3>
            </div>
        );
    }

    const photo = ({ user }) => {
        return (
            <div className="p-multiselect-representative-option">
                <Avatar shape="circle" image={user.photo_max} size='xlarge' />
            </div>
        );
    }

    const buttons = (user) => {
        return (
            <div style={{ display: 'inline-block' }}>
                <Button className='p-ml-2 p-button-danger' label='Разбанить' onClick={() => setUserId(user.id)} />
            </div>
        )
    }

    return (
        <div className="card p-m-6">
            <DataTable
                header={header()}
                value={users}
                className="p-datatable-customers"
                dataKey="id"
                rowHover
                rows={users?.length}
                emptyMessage="Список пуст"
            >
                <Column field="user.id" headerStyle={{ width: '10%', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} header="VK" sortable filter filterPlaceholder="Search" />
                <Column field='user.photo_max' headerStyle={{ width: '10%', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} header="Фото" body={photo} />
                <Column field='user.first_name' header='Имя' sortable filter filterPlaceholder="Search" />
                <Column field='user.last_name' header='Фамилия' sortable filter filterPlaceholder="Search" />
                <Column header='Управление' body={buttons} headerStyle={{ width: '30%', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} />
            </DataTable>
            <Dialog
                header='Внимание!'
                visible={!(userId === null)}
                style={{ with: '50vw' }}
                onHide={() => setUserId(null)}
            >
                Вы уверены, что хотите разбанить пользователя?
                <br />
                <div className='p-mt-4'>
                    <Button
                        label='Да'
                        onClick={() => {
                            unbanUser(userId);
                            setUserId(null);
                        }}
                    />
                    <Button
                        className='p-ml-4'
                        label='Отмена'
                        onClick={() => setUserId(null)}
                    />
                </div>
            </Dialog>
            <Dialog
                header='Внимание!'
                visible={error}
                style={{ with: '50vw' }}
                onHide={() => setError(false)}
            >
                {error}
            </Dialog>
        </div>
    )
}

export default BannedTable;