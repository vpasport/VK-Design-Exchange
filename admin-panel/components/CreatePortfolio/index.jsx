import { Avatar } from 'primereact/avatar';
import { Rating } from 'primereact/rating';
import { InputText } from "primereact/inputtext";
import { InputTextarea } from 'primereact/inputtextarea';
import { MultiSelect } from 'primereact/multiselect';
import FileUpload from '../FileUpload';
import { Button } from 'primereact/button';

const CreatePortfolio = ({
    designer, tags,
    selectTags, setSelectTags,
    previewUrl, uploadPreview,
    uploadWork, workUrl,
    set, save
}) => {
    return (
        <div
        // style={{ margin: 'auto', width: '100%' }}
        >
            <div style={{ width: '80%', margin: 'auto' }}>
                <div>
                    <h3>Автор:</h3>
                    <div className='p-d-flex p-ai-center'>
                        <Avatar shape="circle" image={designer?.photo} size="xlarge" />
                        <div className='p-ml-3'>
                            <div>
                                <b>{designer?.first_name} {designer?.last_name}</b>
                            </div>
                            <Rating value={designer?.rating} readOnly stars={5} cancel={false} className='p-mt-2' />
                        </div>
                    </div>
                </div>
                <div>
                    <h3>Название:</h3>
                    <InputText
                        style={{ width: '100%' }}
                        placeholder='Название'
                        onChange={({ target: { value: title } }) => set({ title })}
                    ></InputText>
                    <h3>Короткое описани (одна строка):</h3>
                    <InputText
                        style={{ width: '100%' }}
                        placeholder='Описание'
                        onChange={({ target: { value: description } }) => set({ description })}
                    ></InputText>
                </div>
                <div>
                    <div
                    style={{ width: '100%' }}
                    >
                        <h3>Тэги:</h3>
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
                <div>
                    <h3>Превью:</h3>
                    <div
                        style={{
                            width: '100%', 
                            textAlign: 'center'
                        }}
                    >
                        <FileUpload
                            onChange={uploadPreview}
                            preview={previewUrl}
                        />
                    </div>
                </div>
                <div>
                    <div>
                        <h3>Описание проекта:</h3>
                        <InputTextarea
                            style={{
                                width: '100%',
                                height: '10vh'
                            }}
                            label='Описание проекта'
                            onChange={({ target: { value: project_description } }) => set({ project_description })}
                        >
                        </InputTextarea>
                    </div>
                    <div>
                        <h3>Описание задачи:</h3>
                        <InputTextarea
                            style={{
                                width: '100%',
                                height: '10vh'
                            }}
                            label='Описание задачи'
                            onChange={({ target: { value: task_description } }) => set({ task_description })}
                        >
                        </InputTextarea>
                    </div>
                    <div>
                        <h3>Проделанная работа:</h3>
                        <InputTextarea
                            style={{
                                width: '100%', 
                                height: '10vh'
                            }}
                            label='Проделанная работа'
                            onChange={({ target: { value: complited_work } }) => set({ complited_work })}
                        >
                        </InputTextarea>
                    </div>
                </div>
                <div>
                    <h3>Работа:</h3>
                    <div style={{
                        // width: '70%',
                        textAlign: 'center'
                    }}>
                        <FileUpload
                            onChange={uploadWork}
                            preview={workUrl}
                        />
                    </div>
                </div>
                <div style={{
                    textAlign: 'center',
                    // width: '70%'
                }}>
                    <Button
                        className='p-m-4'
                        label='Создать'
                        onClick={save}
                    >
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CreatePortfolio;