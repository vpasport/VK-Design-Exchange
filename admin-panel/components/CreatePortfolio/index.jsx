import { Avatar } from 'primereact/avatar';
import { Rating } from 'primereact/rating';
import { InputText } from "primereact/inputtext";
import { MultiSelect } from 'primereact/multiselect';
import FileUpload from '../FileUpload';
import Quill from '../Quill';
import { Button } from 'primereact/button';

const CreatePortfolio = ({
    designer = undefined, tags,
    selectTags, setSelectTags,
    previewUrl, uploadPreview,
    uploadWork, workUrl,
    set, save, creation, setCreation,
    portfolio,
    setProgress
}) => {
    return (
        <div
        // style={{ margin: 'auto', width: '100%' }}
        >
            <div style={{ width: '80%', margin: 'auto' }}>
                <h1>Редактор сайта:</h1>
                {/* <div dangerouslySetInnerHTML={{ __html: text }} /> */}
                {designer !== undefined &&
                    <div className='p-mt-3'>
                        <h3>Автор:</h3>
                        <div className='p-d-flex p-ai-center'>
                            <Avatar shape="circle" image={designer?.photo} size="xlarge" />
                            <div className='p-ml-3'>
                                <div>
                                    <b>{designer?.first_name} {designer?.last_name}</b>
                                </div>
                                <Rating style={{ PointerEvent: 'none' }} value={designer?.rating} readOnly stars={5} cancel={false} className='p-mt-2' />
                            </div>
                        </div>
                    </div>
                }
                <div>
                    <div
                        style={{ width: '100%' }}
                    >
                        <h3>Область работы:</h3>
                        <span className="p-float-label" style={{ width: '100%' }}>
                            <MultiSelect
                                style={{ width: '100%' }}
                                id="multiselect"
                                value={selectTags}
                                options={tags}
                                onChange={(e) => setSelectTags(e.value)}
                                optionLabel="name"
                            />
                            <label htmlFor="multiselect">Тэги</label>
                        </span>
                    </div>
                </div>
                <div className='p-mt-3'>
                    <h3>Название проекта:</h3>
                    <InputText
                        style={{ width: '100%' }}
                        placeholder='Название'
                        onChange={({ target: { value: title } }) => set({ title })}
                    ></InputText>
                </div>
                <div>
                    <h3>Обложка:</h3>
                    <div
                        style={{
                            width: '100%',
                            textAlign: 'center'
                        }}
                    >
                        <FileUpload
                            type='preview'
                            onChange={uploadPreview}
                            preview={previewUrl}
                        />
                    </div>
                </div>
                <div>
                    <div style={{ height: '300px' }}>
                        <h3>Описание проекта:</h3>
                        <Quill
                            text={portfolio.project_description}
                            setText={(e) => set({ project_description: e })}
                        ></Quill>
                    </div>
                </div>
                <div>
                    <h3>Дизайн:</h3>
                    <div style={{
                        // width: '70%',
                        textAlign: 'center'
                    }}>
                        <FileUpload
                            type='work'
                            onChange={uploadWork}
                            preview={workUrl}
                        />
                    </div>
                </div>
                <div style={{
                    textAlign: 'center',
                    // width: '70%'
                }}>
                    <hr className='p-mt-4' />
                    <Button
                        className='p-m-4'
                        label='Опубликовать работу'
                        onClick={() => {
                            setCreation(true);
                            save();
                            setProgress(true);
                        }}
                        disabled={creation}
                    >
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CreatePortfolio;