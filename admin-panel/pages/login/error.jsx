import Link from 'next/link';
import { Button } from 'primereact/button';

const LoginError = () => {
    const uri = encodeURIComponent(`${process.env.NEXT_PUBLIC_SELF_URL}/admin`);

    return (
        <>
            <div className={styles.container}>
                <main className={styles.main}>
                    <h1 className={styles.title}>
                        Доска почёта #ТаняДизайн
                    </h1>

                    <Button className='p-mt-6'>
                        <Link href={`${process.env.NEXT_PUBLIC_API_URL}/oauth/vk?redirect_uri=${uri}`}>Войти через ВКонтакте</Link>
                    </Button>
                </main>
                <Button>
                    <Link href={`${process.env.NEXT_PUBLIC_API_URL}/oauth/vk?redirect_uri=${uri}`}>Войти через ВКонтакте</Link>
                </Button>
            </div>
        </>
    )
}

export default LoginError;