import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';

const CreateUser = ({ link, setLink, create }) => {
    const [cheсked, setChecked] = useState(false);
    const [user, setUser] = useState(null);

    const check = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/check?link=${encodeURI(link)}`, {
            method: 'GET',
            credentials: 'include'
        })

        const { user } = await response.json();

        if (user !== undefined) {
            setChecked(true);
            setUser(user);
        }
    }

    return (
        <div style={{width: '50%', margin: 'auto'}}>
            <h3>Вставьте ссылку ВК или id пользователя</h3>
            <InputText
                placeholder='https://vk.com/example'
                id="username"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                style={{ width: '100%' }}
            />
            <div style={{ textAlign: 'center' }}>
                <Button
                    label='Проверить'
                    className='p-mt-4'
                    onClick={check}
                />
            </div>
            {cheсked &&
                <div className='p-m-4'>
                    <div className='p-d-flex p-ai-center' style={{ width: '50%', margin: 'auto' }}>
                        <span className='p-mr-3'>
                            <h3>{user?.first_name} {user?.last_name}</h3>
                        </span>
                        <Avatar shape="circle" image={user?.photo_max} size='xlarge' />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <Button
                            label='Создать'
                            className='p-mt-4'
                            onClick={create}
                        />
                    </div>
                </div>
            }
        </div>
    )
}

export default CreateUser;