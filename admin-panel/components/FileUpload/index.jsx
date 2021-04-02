const FileUpload = ({ type, onChange, preview }) => {
    const renderText = () => {
        let text;

        switch (type) {
            case 'work':
                text = preview ? 'Заменить макет сайта' : 'Загрузить макет сайта'
                break;
            case 'preview':
                text = preview ? 'Заменить изображение' : 'Загрузить изображение'
                break;
        }

        return text;
    }

    return (
        <>
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
                    <br />
                    <img
                        src={preview}
                        className='p-m-2 p-mx-auto'
                        style={{ maxHeight: '250px' }}
                    />
                </>
            }
        </>
    )
}

export default FileUpload;