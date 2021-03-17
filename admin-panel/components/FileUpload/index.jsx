const FileUpload = ({ onChange, preview }) => {
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
                Выбрать файл
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