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
    save, setProgress,
    change, setChange
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
                        type='preview'
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
                    <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${work?.work_image}`}
                        style={{ width: '70%' }}>
                    </img>
                    :
                    <FileUpload
                        type='work'
                        onChange={uploadWork}
                        preview={workUrl}
                    />
                }
            </div>
            {edit &&
                <div className='p-m-4' style={{ textAlign: 'center' }}>
                    <hr className='p-m-4' />
                    <Button
                        label='Сохранить'
                        onClick={() => {
                            setChange(true);
                            setProgress(true);
                            save();
                        }}
                        disabled={change}
                    >
                    </Button>
                </div>
            }
        </>
    )
}

export default WorkCard;