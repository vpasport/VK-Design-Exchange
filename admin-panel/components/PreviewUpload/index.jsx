import { useRef } from 'react';

import { Toast } from 'primereact/toast';

import styles from './styles.module.scss';

const PreviewUpload = ({ lable, onChange, preview }) => {
    const renderText = () => {
        return preview ? 'Заменить превью' : 'Загрузить превью'
    }

    const toast = useRef(null);

    return (
        <>
            {!preview &&
                <>
                    <p style={{ color: 'red' }}>Рекомендуется использовать квадратное изображение</p>
                    <p style={{ color: 'red' }}>Максимальный размер файла: 5 MБ.</p>
                    <p style={{ color: 'red' }}>Перед загрузкой рекомендуется сжать изображение через <a href='https://tinypng.com/' target='_blank' style={{ fontWeight: 'bold' }}>Tinypng</a></p>
                </>
            }
            <div
                className='p-button'
                style={{
                    position: 'relative',
                    pointerEvents: 'none',
                    userSelect: 'none'
                }}
            >
                {renderText()}
                <input
                    type="file"
                    onChange={(e) => {
                        const file = e.target.files[0];

                        if (file.size / 1024 / 1024 / 5 > 1) {
                            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Превышен допустимый размер файла', life: 3000 });
                            return;
                        }

                        onChange(e);
                    }}
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
            {
                preview &&
                <>
                    {!preview.square && <h3 style={{ color: 'red' }}>Ваше изображение не квадратное</h3>}
                    <br
                    />
                    <div
                        className={styles.card}
                        style={{
                            marginTop: preview ? '10px' : '0px'
                        }}
                    >
                        <div className={styles.imgBlock}>
                            <img src={preview.path} className={styles.imgBlock__img} />
                        </div>
                        <h5>
                            {lable}
                        </h5>
                    </div>
                </>
            }
            <Toast ref={toast} position="bottom-right" />
        </>
    )
}

export default PreviewUpload;