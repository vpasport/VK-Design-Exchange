import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';

const DesignersTable = ({ tags, deleteTag, updateTag }) => {
    const [tagUpdated, setTagUpdated] = useState('');
    const [edit, setEdit] = useState(false);

    const [tagId, setTagId] = useState(null);

    const setTag = (json) => {
        setTagUpdated(prev => ({
            ...prev, ...json
        }))
    }

    const buttons = (tag) => {
        return (
            <div style={{ display: 'inline-block' }}>
                {edit && tag.id === tagUpdated.id &&
                    <Button
                        className='p-mr-2'
                        label='Сохранить'
                        onClick={() => {
                            updateTag(tag.id, tagUpdated.name)
                            setEdit(false)
                        }}
                    ></Button>
                }
                <Button
                    label={!edit ? 'Редактировать' : 'Отмена'}
                    onClick={() => !edit ? (setEdit(true), setTagUpdated(tag)) : setEdit(false)}
                >
                </Button>
                <Button className='p-ml-2 p-button-danger' label='Удалить' onClick={() => setTagId(tag.id)} />
            </div>
        )
    }

    const name = (tag) => {
        return (
            <>
                {!edit ?
                    <p>{tag.name}</p>
                    :
                    tag.id === tagUpdated.id ?
                        <InputText
                            placeholder='Название'
                            value={tagUpdated.name}
                            style={{ width: '100%' }}
                            onChange={({ target: { value: name } }) => setTag({ name })}
                        ></InputText>
                        :
                        <p>{tag.name}</p>
                }
            </>
        )
    }

    return (
        <>
            <div className="card">
                <DataTable
                    value={tags}
                    className="p-datatable-customers"
                    dataKey="id"
                    rowHover
                    rows={tags.length}
                    emptyMessage="No customers found"
                >
                    <Column body={name} headerStyle={{ textAlign: 'center' }} bodyStyle={{ overflow: 'visible' }} header="Название" sortable filter filterPlaceholder="Search" />
                    <Column header='Управление' body={buttons} headerStyle={{ width: '30%', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} />
                </DataTable>
            </div>
            <Dialog
                header='Внимание!'
                visible={!(tagId === null)}
                style={{ with: '50vw' }}
                onHide={() => setTagId(null)}
            >
                Вы уверены, что хотите удалить тэг?
                <br />
                <div className='p-mt-4'>
                    <Button
                        label='Да'
                        onClick={() => {
                            deleteTag(tagId);
                            setTagId(null);
                        }}
                    />
                    <Button
                        className='p-ml-4'
                        label='Отмена'
                        onClick={() => setTagId(null)}
                    />
                </div>
            </Dialog>
        </>
    )
}

export default DesignersTable;