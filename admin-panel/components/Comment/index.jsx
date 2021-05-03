import { useState } from "react";

const { Avatar } = require("primereact/avatar")

const Comment = ({
    user, text,
    date
}) => {
    const [_date, setDate] = useState(new Date((Number(date) + new Date().getTimezoneOffset() * 60) * 1000))

    return (
        <div className='p-d-flex p-ai-center p-mt-6 p-mb-6'>
            <Avatar shape='circle' image={user.photo_max} size="xlarge" />
            <div className='p-ml-4'>
                <div className='p-d-inline-flex'>
                    <b>{user.first_name} {user.last_name}</b> <div className='p-ml-3'>{_date.toLocaleString('ru-RU')}</div>
                </div>
                <hr></hr>
                <div>
                    {text}
                </div>
            </div>
        </div>
    )
}

export default Comment;