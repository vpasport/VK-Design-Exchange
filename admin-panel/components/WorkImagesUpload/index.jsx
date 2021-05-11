import { useEffect, useState, useRef } from "react";
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useRouter } from 'next/router';

const WorkImagesUpload = ({
    onChange = () => { }, previews = undefined,
    edit = false
}) => {
    const { query: { id } } = useRouter();

    const [images, setImages] = useState([]);

    const [removeImageIndex, setRemoveImageIndex] = useState(null);

    const [progress, setProgress] = useState(false);

    const toast = useRef(null);

    const addFirstImage = async ({ target }) => {
        const file = target.files[0];

        if (file) {
            if (file.size / 1024 / 1024 / 5 > 1) {
                target.value = "";
                toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Превышен допустимый размер файла', life: 3000 });
            } else {
                if (edit) {
                    const formData = new FormData();

                    formData.append('image', file);
                    formData.append('position', 0);

                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio/work/${id}/image`, {
                        method: 'POST',
                        credentials: 'include',
                        body: formData
                    })

                    if (!response.ok)
                        return;

                    setProgress(false);
                }

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

    const addImage = async ({ target }) => {
        const file = target.files[0];

        if (file) {
            if (file.size / 1024 / 1024 / 5 > 1) {
                target.value = "";
                toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Превышен допустимый размер файла', life: 3000 });
            } else {
                if (edit) {
                    const formData = new FormData();

                    formData.append('image', file);

                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio/work/${id}/image`, {
                        method: 'POST',
                        credentials: 'include',
                        body: formData
                    })

                    if (!response.ok)
                        return;

                    setProgress(false);
                }

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

    const insertImage = async ({ target }, index) => {
        const file = target.files[0];

        if (file) {
            if (file.size / 1024 / 1024 / 5 > 1) {
                target.value = "";
                toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Превышен допустимый размер файла', life: 3000 });
            } else {
                if (edit) {
                    const formData = new FormData();

                    formData.append('image', file);
                    formData.append('position', index + 1 );

                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio/work/${id}/image`, {
                        method: 'POST',
                        credentials: 'include',
                        body: formData
                    })

                    if (!response.ok)
                        return;

                    setProgress(false);
                }

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

    useEffect(() => {
        if (previews) {
            setImages(prev => {
                let tmp = previews.map(el => {
                    el.path = `${process.env.NEXT_PUBLIC_API_URL}/${el.path}`;
                    return {
                        ...el
                    }
                })

                return tmp;
            })
        }
    }, [])

    const removeImage = async (i) => {
        if (edit) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio/work/${id}/image/${i}`, {
                method: 'DELETE',
                credentials: 'include'
            })

            if (!response.ok)
                return;
        }

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
                    onClick={(e) => {
                        if (edit) setProgress(true);
                        addImage(e);
                    }}
                />
                :
                <Button
                    label='Вставить изображение в начало'
                    onClick={(e) => {
                        if (edit) setProgress(true);
                        addFirstImage(e);
                    }}
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
                                    fontSize: '24px'
                                }}
                                onClick={() => setRemoveImageIndex(i)}
                            />
                        </div>
                        {i === images.length - 1 ?
                            <>
                                <br />
                                <Button
                                    label='Добавить изображение'
                                    onClick={(e) => {
                                        if (edit) setProgress(true);
                                        addImage(e);
                                    }}
                                />
                            </>
                            :
                            <>
                                <br />
                                <Button
                                    label='Вставить изображение'
                                    onClick={(event) => {
                                        if (edit) setProgress(true);
                                        insertImage(event, i)
                                    }}
                                />
                            </>
                        }
                    </div>
                )
            }
            <Toast ref={toast} position="bottom-right" />
            <Dialog
                header="Загрузка"
                visible={progress}
                style={{ width: '200px', textAlign: 'center' }}
                closable={false}
            >
                <ProgressSpinner style={{ width: '30px', height: '30px' }} strokeWidth="4" animationDuration="1.5s" />
            </Dialog>
        </>
    )
}

export default WorkImagesUpload;