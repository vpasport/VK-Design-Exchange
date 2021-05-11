import { useEffect, useState, useRef } from "react";
import { Toast } from 'primereact/toast';

const WorkImagesUpload = ({ onChange = () => { } }) => {
    const [images, setImages] = useState([]);
    const [imagesFiles, setImagesFiles] = useState([]);

    const [removeImageIndex, setRemoveImageIndex] = useState(null);

    const toast = useRef(null);

    const addFirstImage = ({ target }) => {
        const file = target.files[0];

        if (file) {
            if (file.size / 1024 / 1024 / 5 > 1) {
                target.value = "";
                toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Превышен допустимый размер файла', life: 3000 });
            } else {
                setImages(prev => [
                    {
                        path: URL.createObjectURL(file),
                        file
                    },
                    ...prev
                ]);
            }
        }
    }

    const addImage = ({ target }) => {
        const file = target.files[0];

        if (file) {
            if (file.size / 1024 / 1024 / 5 > 1) {
                target.value = "";
                toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Превышен допустимый размер файла', life: 3000 });
            } else {
                setImages(prev => [
                    ...prev,
                    {
                        path: URL.createObjectURL(file),
                        file
                    }
                ]);
            }
        }
    }

    const insertImage = ({ target }, index) => {
        const file = target.files[0];

        if (file) {
            if (file.size / 1024 / 1024 / 5 > 1) {
                target.value = "";
                toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Превышен допустимый размер файла', life: 3000 });
            } else {
                setImages(prev => {
                    let tmp = [...prev];
                    tmp.splice(index + 1, 0, {
                        path: URL.createObjectURL(file),
                        file
                    });
                    return tmp;
                });
            }
        }
    }

    const removeImage = (i) => {
        let tmp = images;
        tmp.splice(i, 1);
        setImages(tmp);
        setRemoveImageIndex(null);
    }

    useEffect(() => {
        if (removeImageIndex !== null) {
            removeImage(removeImageIndex);
        }
    }, [removeImageIndex])

    useEffect(() => {
        onChange(images);
    }, [images])

    const Button = ({ label, onClick }) =>
        <div
            className='p-button'
            style={{
                position: 'relative',
                pointerEvents: 'none',
                userSelect: 'none'
            }}
        >
            {label}
            <input
                type="file"
                onChange={onClick}
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    zIndex: '500',
                    opacity: '0',
                    pointerEvents: 'auto'
                }}
            />
        </div>

    return (
        <>
            <p style={{ color: 'red' }}>Максимальный размер для одного файла - 5 мб.</p>
            <p style={{ color: 'red' }}>Макисальное количество файлов - 30.</p>
            {images.length === 0 ?
                <Button
                    label='Загрузить изображение'
                    onClick={addImage}
                />
                :
                <Button
                    label='Вставить изображение в начало'
                    onClick={addFirstImage}
                />
            }
            {images.length > 0 &&
                images.map((el, i) =>
                    <div
                        key={`${i}`}
                    >
                        <br />
                        <div
                            style={{
                                position: 'relative',
                                margin: 'auto',
                                maxHeight: '250px',
                                display: 'inline-flex'
                            }}
                        >
                            <img
                                src={el.path}
                                style={{
                                    maxHeight: '250px',
                                    display: 'block'
                                }}
                            />
                            <i
                                className="pi pi-times"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    padding: 10,
                                    color: '#fff',
                                    fontSize: '2em'
                                }}
                                onClick={() => setRemoveImageIndex(i)}
                            />
                        </div>
                        {i === images.length - 1 ?
                            <>
                                <br />
                                <Button
                                    label='Добавить изображение'
                                    onClick={addImage}
                                />
                            </>
                            :
                            <>
                                <br />
                                <Button
                                    label='Вставить изображение'
                                    onClick={(event) => insertImage(event, i)}
                                />
                            </>
                        }
                    </div>
                )
            }
            <Toast ref={toast} position="bottom-right" />
        </>
    )
}

export default WorkImagesUpload;