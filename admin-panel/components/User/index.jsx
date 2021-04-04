import { Avatar } from 'primereact/avatar';

const User = ({ name, photo }) => {
    return (
        <div className='p-d-flex p-ai-center'>
            <span className='p-mr-3'>
                <b>{name}</b>
            </span>
            <Avatar shape="circle" image={photo} />
        </div>
    )
}

export default User;