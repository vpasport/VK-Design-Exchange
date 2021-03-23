import ReactQuill from 'react-quill';

const Quill = ({ text, setText }) => {
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ],
        clipboard: {
            matchVisual: false
        }
    }

    return (
        <ReactQuill
            theme="snow"
            modules={modules}
            value={text}
            onChange={setText}
            style={{ height: '70%' }}
        />
    )
}

export default Quill;