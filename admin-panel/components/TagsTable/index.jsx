import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';

const DesignersTable = ({
    setError, setDialog
}) => {
    const [tags, setTags] = useState([]);

    const [tagUpdated, setTagUpdated] = useState('');
    const [edit, setEdit] = useState(false);
    const [designers, setDesigners] = useState(false);
    const [create, setCreate] = useState(false);

    const [tagId, setTagId] = useState(null);
    const [createName, setCreateName] = useState('');

    const setTag = (json) => {
        setTagUpdated(prev => ({
            ...prev, ...json
        }))
    }

    const getSpecializations = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/specializations`);

        if (response.ok) {
            const json = await response.json();
            setTags(json.specializations);
        }
    }

    const getTags = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`);

        if (response.ok) {
            const json = await response.json();
            setTags(json.tags);
        }
    }

    useEffect(() => {
        if (designers) {
            getSpecializations();
        } else {
            getTags();
        }
        setEdit(false);
    }, [designers])

    const createElement = async () => {
        setError('');
        if (createName !== '') {
            let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${designers ? 'specializations' : 'tags'}/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: createName
                })
            })

            if (!response.ok) {
                setError('Не удалось создать элемент');
                setDialog(true);
                return;
            }

            response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${designers ? 'specializations' : 'tags'}/`);
            const json = await response.json();

            setTags(json[designers ? 'specializations' : 'tags']);
            setCreate(false);
            return;
        }

        setError('Заполните название элемента');
        setDialog(true);
    }

    const updateElement = async (id, name) => {
        setError('')
        if (name !== '') {
            let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${designers ? 'specializations' : 'tags'}/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name
                })
            })

            if (!response.ok) {
                setError('Не удалось изменить элемент');
                setDialog(true);
                return;
            }

            response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${designers ? 'specializations' : 'tags'}/`);
            const json = await response.json();

            setTags(json[designers ? 'specializations' : 'tags']);
            return;
        }

        setError('Заполните поле названия элемента');
        setDialog(true);
    }

    const deleteElement = async (id) => {
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${designers ? 'specializations' : 'tags'}/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (!response.ok) {
            setError('Не удалось удалить элемент');
            setDialog(true);
            return;
        }

        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${designers ? 'specializations' : 'tags'}/`);
        const json = await response.json();

        setTags(json[designers ? 'specializations' : 'tags']);
    }

    const buttons = (tag) => {
        return (
            <div style={{ display: 'inline-block' }}>
                {edit && tag.id === tagUpdated.id &&
                    <Button
                        className='p-mr-2'
                        label='Сохранить'
                        onClick={() => {
                            updateElement(tag.id, tagUpdated.name)
                            setEdit(false)
                        }}
                    />
                }
                <Button
                    label={!edit ? 'Редактировать' : 'Отмена'}
                    onClick={() => !edit ? (setEdit(true), setTagUpdated(tag)) : setEdit(false)}
                />
                <Button
                    label='Удалить'
                    className='p-ml-2 p-button-danger'
                    onClick={() => deleteElement(tag.id)}
                />
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

    const header = () => {
        return (
            <div className='p-d-flex p-jc-between' style={{ textAlign: 'center' }}>
                <h3>Список {designers ? 'специализация дизайнеров' : 'тегов работ'}</h3>
                <span>
                    <Button
                        label={!designers ? 'Специализации дизацнеров' : 'Теги работ'}
                        icon={!designers ? 'pi pi-users' : 'pi pi-id-card'}
                        className={'p-button-help'}
                        onClick={() => setDesigners(!designers)}
                    />
                    <Button
                        label='Добавить'
                        icon='pi pi-plus'
                        className='p-ml-2'
                        onClick={() => setCreate(true)}
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
                    value={tags}
                    className="p-datatable-customers"
                    dataKey="id"
                    rowHover
                    rows={tags?.length}
                    emptyMessage="No customers found"
                >
                    <Column body={name} headerStyle={{ textAlign: 'center' }} bodyStyle={{ overflow: 'visible' }} header="Название" />
                    <Column header='Управление' body={buttons} headerStyle={{ width: '30%', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} />
                </DataTable>
            </div>
            <Dialog
                header='Добавить'
                visible={create}
                style={{ width: '50vw' }}
                onHide={() => setCreate(false)}
            >
                <InputText
                    placeholder='Название'
                    value={createName}
                    style={{ width: '100%' }}
                    onChange={({ target: { value: name } }) => setCreateName(name)}
                />
                <div className='p-mt-3'>
                    <Button
                        label={'Создать'}
                        onClick={() => createElement()}
                    />
                    <Button
                        label={'Отмена'}
                        onClick={() => setCreate(false)}
                        className='p-ml-3 p-button-danger'
                    />
                </div>
            </Dialog>
            <Dialog
                header='Внимание!'
                visible={!(tagId === null)}
                style={{ width: '50vw' }}
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