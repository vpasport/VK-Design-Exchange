import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Rating } from 'primereact/rating';
import { InputText } from "primereact/inputtext";
import { MultiSelect } from 'primereact/multiselect';
import { Message } from 'primereact/message';
import Quill from '../Quill';
import { Dialog } from 'primereact/dialog';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import MyImage from '../Image';
import Comment from '../Comment';
import PreviewUpload from '../PreviewUpload';
import WorkImagesUpload from '../WorkImagesUpload';
import { Checkbox } from 'primereact/checkbox';

const WorkCard = ({
    work, edit,
    tags, selectedTags, setSelectedTags,
    updateWork, set,
    uploadWork, workUrl,
    uploadPreview, previewUrl,
    save, setProgress,
    change, setChange,
    user
}) => {
    const { query: { id } } = useRouter()

    const [dialog, setDialog] = useState(false);

    const [comments, setComments] = useState([]);

    const [forSale, setForSale] = useState(work?.is_for_sale)

    const getComments = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio/work/${id}/comments?all=true`);

        const { comments } = await response.json();

        setComments(comments);
    }

    useEffect(() => {
        getComments()
    }, [])

    return (
        <>
            <div style={{ width: '70%', margin: 'auto' }} className='p-mt-6'>
                <div className='p-d-flex p-ai-center'>
                    <div className='p-d-flex p-ai-center'>
                        <Avatar shape="circle" image={work?.author?.photo} size="xlarge" />
                        <div className='p-ml-3'>
                            <div>
                                <b>{work?.author?.first_name} {work?.author?.last_name}</b>
                            </div>
                            <Rating value={work?.author?.rating} readOnly stars={5} cancel={false} className='p-mt-2' />
                        </div>
                    </div>
                    {work?.is_hidden &&
                        <Message severity='info' text='Работа скрыта, пользователи приложения ее не видят' className='p-ml-4' />
                    }
                </div>
                <div className='p-mt-3'>
                    {!edit ?
                        work?.tags.map((el, i) => (
                            <Button key={i} label={el.name} className="p-button-outlined p-button-rounded p-mr-2" />
                        ))
                        :
                        <span className="p-float-label p-mt-6" style={{ width: '100%' }}>
                            <MultiSelect
                                style={{ width: '100%' }}
                                id="multiselect"
                                value={selectedTags}
                                options={tags}
                                onChange={(e) => setSelectedTags(e.value)}
                                optionLabel="name"
                            />
                            <label htmlFor="multiselect">Тэги</label>
                        </span>
                    }
                </div>
                <div>
                    <h3>Название:</h3>
                    {edit ?
                        <>
                            <div className="p-inputgroup p-m-1">
                                <p>Название:</p>
                                <InputText
                                    className='p-ml-3'
                                    placeholder={work?.title || 'Название'}
                                    value={updateWork.title}
                                    onChange={({ target: { value: title } }) => set({ title })}
                                />
                            </div>
                        </>
                        :
                        <p><b>{work?.title}</b></p>
                    }
                </div>
            </div>
            <div style={{ textAlign: 'center' }} className='p-mt-6 p-mb-6'>
                {!edit ?
                    <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${work?.preview}`}
                        style={{ width: '50%' }}>
                    </img>
                    :
                    <PreviewUpload
                        lable={work?.title}
                        onChange={uploadPreview}
                        preview={previewUrl}
                    />
                }
            </div>
            <div style={{ width: '70%', margin: 'auto' }}>
                <div>
                    <h3>Описание проекта:</h3>
                    {!edit ?
                        <div dangerouslySetInnerHTML={{ __html: work?.project_description }} />
                        :
                        <Quill
                            text={updateWork?.project_description}
                            setText={(e) => set({ project_description: e })}
                        ></Quill>
                    }
                </div>
            </div>
            <div style={{ textAlign: 'center' }} className='p-mt-6 p-mb-6'>
                {!edit ?
                    work?.images?.map((el, i) =>
                        <MyImage
                            key={i}
                            path={`${process.env.NEXT_PUBLIC_API_URL}/${el.path}`}
                        />
                    )
                    :
                    <WorkImagesUpload
                        previews={work?.images}
                        onChange={uploadWork}
                        edit={true}
                    />
                }
            </div>
            <div
                style={{
                    width: '70%',
                    margin: 'auto'
                }}
            >
                {edit ?
                    <div>
                        <h3>Продажа шаблона:</h3>
                        <div>
                            <Checkbox
                                inputId="forSale"
                                checked={forSale}
                                onChange={() => {
                                    setForSale(!forSale);
                                    set({ is_for_sale: !forSale });
                                }}
                            />
                            <label htmlFor="forSale" className="p-checkbox-label p-ml-2">Отображать кнопку "Купить шаблон"</label>
                        </div>
                    </div>
                    :
                    <h3>{work?.is_for_sale && 'Шаблон для продажи'}</h3>
                }
            </div>
            {edit &&
                <div className='p-m-4' style={{ textAlign: 'center' }}>
                    <hr className='p-m-4' />
                    <Button
                        label='Сохранить'
                        onClick={() => setDialog(true)}
                        disabled={change}
                    >
                    </Button>
                </div>
            }
            <div
                style={{
                    width: '70%',
                    margin: 'auto'
                }}
                className='p-d-flex p-ai-center'
            >
                <div className='p-d-flex p-ai-center'>
                    <i className='pi pi-eye' style={{ paddingTop: 2 }}></i><p className='p-ml-1'>{work?.views}</p>
                </div>
                <div className='p-d-flex p-ai-center p-ml-3'>
                    <i className='pi pi-heart' style={{ paddingTop: 2, color: '#e64646' }}></i><p className='p-ml-1'>{work?.likes?.count}</p>
                </div>
            </div>
            <div style={{ width: '70%', margin: 'auto', marginBottom: '10%' }}>
                <h3>Комментарии:</h3>
                {comments.length === 0 && `Комментарии отсутствуют`}
                {comments.map(el => {
                    return (
                        <Comment
                            id={el.id}
                            user={user}
                            vkUser={el.user}
                            text={el.text}
                            date={el.create_date}
                            getComments={getComments}
                        />
                    )
                })}
            </div>
            <Dialog
                header='Опубликовать'
                visible={dialog}
                style={{ width: '50vw' }}
                onHide={() => setDialog(false)}
            >
                <h3>Публикуем?</h3>
                <br />
                <div>
                    <Button
                        label='Конечно'
                        onClick={() => {
                            setDialog(false);
                            setChange(true);
                            setProgress(true);
                            save();
                        }}
                    />
                    <Button
                        className='p-ml-4 p-button-secondary'
                        label='Еще подумаю'
                        onClick={() => setDialog(false)}
                    />
                </div>
            </Dialog>
        </>
    )
}

export default WorkCard;