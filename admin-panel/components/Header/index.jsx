import { TabMenu } from 'primereact/tabmenu';
import User from '../User';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';

const Header = ({ url, user }) => {
    const router = useRouter();

    const items = [
        {label: 'Главная', url: '/admin'},
        { label: 'Все работы', icon: 'pi pi-fw pi-desktop', url: '/admin/portfolios' },
        { label: 'Calendar', icon: 'pi pi-fw pi-calendar' },
        { label: 'Edit', icon: 'pi pi-fw pi-pencil' },
        { label: 'Documentation', icon: 'pi pi-fw pi-file' },
        { label: 'Settings', icon: 'pi pi-fw pi-cog' }
    ];

    const logout = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
            credentials: 'include'
        });

        router.push('/');
    }

    return (
        <div className='p-d-flex p-jc-between p-ai-center'>
            <TabMenu model={items}
                activeItem={items.find(el => el.url === url)}
                onTabChange={(e) => router.push(e.value.url)}
            />
            <div className='p-d-flex p-ai-center'>
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