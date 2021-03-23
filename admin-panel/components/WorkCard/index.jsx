import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Rating } from 'primereact/rating';
import { InputText } from "primereact/inputtext";
import { MultiSelect } from 'primereact/multiselect';
import { InputTextarea } from 'primereact/inputtextarea';
import FileUpload from '../FileUpload';
import Quill from '../Quill';

const WorkCard = ({
    work, edit,
    tags, selectedTags, setSelectedTags,
    updateWork, set,
    uploadWork, workUrl,
    uploadPreview, previewUrl,
    save
}) => {
    return (
        <>
            <div style={{ width: '70%', margin: 'auto' }} className='p-mt-6'>
                <div className='p-d-flex p-ai-center'>
                    <Avatar shape="circle" image={work?.author?.photo} size="xlarge" />
                    <div className='p-ml-3'>
                        <div>
                            <b>{work?.author?.first_name} {work?.author?.last_name}</b>
                        </div>
                        <Rating value={work?.author?.rating} readOnly stars={5} cancel={false} className='p-mt-2' />
                    </div>
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
                            {/* <div className="p-inputgroup p-m-1">
                                <p>Описание:</p>
                                <InputText
                                    className='p-ml-3'
                                    placeholder={work?.description || 'Описание'}
                                    value={updateWork.description}
                                    onChange={({ target: { value: description } }) => set({ description })}
                                />
                            </div> */}
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
                    <FileUpload
                        onChange={uploadPreview}
                        preview={previewUrl}
                    />
                }
            </div>
            <div style={{ width: '70%', margin: 'auto' }}>
                <div>
                    <h3>Описание проекта:</h3>
                    {!edit ?
                        <div dangerouslySetInnerHTML={{__html: work?.project_description}} />
                        :
                        <Quill
                            text={updateWork?.project_description}
                            setText={(e) => set({ project_description: e })}
                        ></Quill>
                        // <InputTextarea
                        //     style={{ width: '100%', height: '15vh' }}
                        //     label='Описание проекта'
                        //     value={updateWork?.project_description}
                        //     onChange={({ target: { value: project_description } }) => set({ project_description })}
                        // >
                        // </InputTextarea>
                    }
                </div>
                {/* <div>
                    <h3>Описание задачи:</h3>
                    {!edit ?
                        <p style={{ whiteSpace: 'pre-wrap' }}>{work?.task_description}</p>
                        :
                        <InputTextarea
                            style={{ width: '100%', height: '15vh' }}
                            label='Описание проекта'
                            value={updateWork?.task_description}
                            onChange={({ target: { value: task_description } }) => set({ task_description })}
                        >
                        </InputTextarea>
                    }
                </div> */}
                {/* <div>
                    <h3>Выполненная работа:</h3>
                    {!edit ?
                        <p style={{ whiteSpace: 'pre-wrap' }}>{work?.completed_work}</p>
                        :
                        <InputTextarea
                            style={{ width: '100%', height: '15vh' }}
                            label='Описание проекта'
                            value={updateWork?.completed_work}
                            onChange={({ target: { value: completed_work } }) => set({ completed_work })}
                        >
                        </InputTextarea>
                    }
                </div> */}
            </div>
            <div style={{ textAlign: 'center' }} className='p-mt-6 p-mb-6'>
                {!edit ?
                    <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${work?.work_image}`}
                        style={{ width: '70%' }}>
                    </img>
                    :
                    <FileUpload
                        onChange={uploadWork}
                        preview={workUrl}
                    />
                }
            </div>
            {edit &&
                <div className='p-m-4' style={{ textAlign: 'center' }}>
                    <Button
                        label='Сохранить'
                        onClick={save}
                    >
                    </Button>
                </div>
            }
        </>
    )
}

export default WorkCard;