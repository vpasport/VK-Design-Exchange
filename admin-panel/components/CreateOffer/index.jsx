import FileUpload from "../FileUpload";
import Quill from "../Quill";

import { InputText } from "primereact/inputtext";
import { InputNumber } from 'primereact/inputnumber';
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Rating } from "primereact/rating";

const CreateOffer = ({
    designer = undefined,
    previewUrl, uploadPreview,
    set, save, creation, setCreation,
    offer,
    setProgress
}) => {
    return (
        <div>
            <div style={{ width: '80%', margin: 'auto' }}>
                {designer !== undefined &&
                    <div>
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
                    <h3>Название:</h3>
                    <InputText
                        style={{ width: '100%' }}
                        placeholder='Название'
                        value={offer.title}
                        onChange={({ target: { value: title } }) => set({ title })}
                    ></InputText>
                </div>
                <div>
                    <h3>Стоимость:</h3>
                    <InputNumber
                        style={{ width: '100%' }}
                        mode="currency" currency="RUB"
                        placeholder={'Стоимость'}
                        value={offer.price}
                        onChange={({ value: price }) => set({ price })}
                    />
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
                    <div style={{ height: '300px' }}>
                        <h3>Описание:</h3>
                        <Quill
                            text={offer.description}
                            setText={(e) => set({ description: e })}
                        ></Quill>
                    </div>
                </div>
                <div style={{
                    textAlign: 'center',
                    // width: '70%'
                }}>
                    <hr className='p-mt-4' />
                    <Button
                        className='p-m-4'
                        label='Создать'
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

export default CreateOffer;