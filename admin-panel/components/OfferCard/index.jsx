import { Avatar } from "primereact/avatar";
import { InputText } from "primereact/inputtext";
import { InputNumber } from 'primereact/inputnumber';
import { Rating } from "primereact/rating";
import FileUpload from "../FileUpload";
import Quill from "../Quill";
import { Button } from "primereact/button";

const OfferCard = ({
    offer, edit,
    updateOffer, set,
    uploadPreview, previewUrl,
    save, setProgress,
    change, setChange
}) => {
    return (
        <>
            <div style={{ width: '70%', margin: 'auto' }} className='p-mt-6'>
                <div className='p-d-flex p-ai-center'>
                    <Avatar shape="circle" image={offer?.author?.photo} size="xlarge" />
                    <div className='p-ml-3'>
                        <div>
                            <b>{offer?.author?.first_name} {offer?.author?.last_name}</b>
                        </div>
                        <Rating value={offer?.author?.rating} readOnly stars={5} cancel={false} className='p-mt-2' />
                    </div>
                </div>
                <div>
                    <h3>Название:</h3>
                    {edit ?
                        <>
                            <div className="p-inputgroup p-m-1">
                                <p>Название:</p>
                                <InputText
                                    className='p-ml-3'
                                    placeholder={offer?.title || 'Название'}
                                    value={updateOffer?.title}
                                    onChange={({ target: { value: title } }) => set({ title })}
                                />
                            </div>
                        </>
                        :
                        <p><b>{offer?.title}</b></p>
                    }
                </div>
                <div>
                    <h3>Стоимость:</h3>
                    {edit ?
                        <>
                            <div className="p-inputgroup p-m-1">
                                <p>Стоимость:</p>
                                <InputNumber
                                    mode="currency" currency="RUB"
                                    className='p-ml-3'
                                    placeholder={offer?.price || 'Стоимость'}
                                    value={updateOffer.price}
                                    onChange={({ value: price }) => set({ price })}
                                />
                            </div>
                        </>
                        :
                        <p><b>{offer?.price}</b></p>
                    }
                </div>
            </div>
            <div style={{ textAlign: 'center' }} className='p-mt-6 p-mb-6'>
                {!edit ?
                    <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${offer?.preview}`}
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
                        <div dangerouslySetInnerHTML={{ __html: offer?.description }} />
                        :
                        <Quill
                            text={updateOffer?.description}
                            setText={(e) => set({ description: e })}
                        ></Quill>
                    }
                </div>
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

export default OfferCard;