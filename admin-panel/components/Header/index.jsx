import { TabMenu } from 'primereact/tabmenu';
import User from '../User';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { InputSwitch } from 'primereact/inputswitch';

const Header = ({ url, user }) => {
    const router = useRouter();

    const [admin, setAdmin] = useState(user.mainRole === 'admin')

    const items = [
        // { label: 'Settings', icon: 'pi pi-fw pi-cog' }
    ];

    if (user.mainRole === 'admin') {
        items.push(...[
            // { label: 'Главная', url: '/admin' },
            { label: 'Все работы', icon: 'pi pi-fw pi-briefcase', url: '/admin/portfolios' },
            { label: 'Дизайнеры', icon: 'pi pi-fw pi-users', url: '/admin/designers' },
            { label: 'Тэги', icon: 'pi pi-fw pi-tags', url: '/admin/tags' },
            { label: 'Администраторы', icon: 'pi pi-fw pi-shield', url: '/admin/admins' },
            { label: 'Предложения', icon: 'pi pi-fw pi-list', url: '/admin/offers' },
            { label: 'Заказы', icon: 'pi pi-fw pi-shopping-cart', url: '/admin/orders' },
            { label: 'Бан-лист', icon: 'pi pi-fw pi-user-minus', url: '/admin/banned' }
        ])
    }
    if (user.mainRole === 'designer') {
        items.push(...[
            // { label: 'Главная', url: '/designer' },
            { label: 'Мой профиль', icon: 'pi pi-fw pi-user', url: '/designer/profile' },
            { label: 'Моё портфолио', icon: 'pi pi-fw pi-briefcase', url: '/designer/portfolio' },
            { label: 'Мои предложения', icon: 'pi pi-fw pi-list', url: '/designer/offers' },
            { label: 'Мои заказы', icon: 'pi pi-fw pi-shopping-cart', url: '/designer/orders' }
        ])
    }


    const logout = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
            credentials: 'include'
        });

        router.push('/');
    }

    const changeRole = async (event) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/change_role`, {
            method: 'PUT',
            credentials: 'include'
        })
        const { mainRole } = await response.json();

        user.mainRole = mainRole;

        if (user.mainRole === 'designer') router.push('/designer/profile');
        if (user.mainRole === 'admin') router.push('/admin/portfolios');

        setAdmin(!admin)
    }

    return (
        <div
            className='p-d-flex p-jc-between p-ai-center p-shadow-3 p-p-2'
            style={{
                // borderRadius: '5px',
                // width: '100vw',
            }}
        >
            <TabMenu
                // className='p-ml-2'
                model={items}
                activeItem={items.find(el => el.url === url)}
                onTabChange={(e) => router.push(e.value.url)}
            />
            <div className='p-d-flex p-ai-center'>
                {user.role.length === 2 &&
                    <div className='p-d-flex p-ai-center p-mr-3'>
                        <span className='p-mr-2'>
                            <h3>Admin</h3>
                        </span>
                        <InputSwitch checked={admin} onChange={(e) => changeRole(e)} />
                    </div>
                }
                <User
                    name={user.first_name}
                    photo={user.photo_max}
                />
                <Button
                    label='Выход'
                    onClick={() => logout()}
                    className='p-ml-3'
                />
            </div>
        </div>
    )
}

export default Header;