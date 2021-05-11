import styles from './styles.module.scss';

const PreviewUpload = ({ lable, onChange, preview }) => {
    const renderText = () => {
        return preview ? 'Заменить превью' : 'Загрузить превью'
    }

    return (
        <>
            {!preview &&
                <p style={{ color: 'red' }}>Рекомендуется использовать квадратное изображение</p>
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
                    onChange={onChange}
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
        </>
    )
}

export default PreviewUpload;