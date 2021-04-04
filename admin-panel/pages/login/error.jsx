import Link from 'next/link';
import { Button } from 'primereact/button';
import styles from '../../styles/Home.module.css';

const LoginError = () => {
    const uri = encodeURIComponent(`${process.env.NEXT_PUBLIC_SELF_URL}/admin`);

    return (
        <>
            <div className={styles.container}>
                <main className={styles.main}>
                    <h1 className={styles.title}>
                        Ошибка авторизации
                    </h1>

                    <Button className='p-mt-6'>
                        <Link href={`${process.env.NEXT_PUBLIC_SELF_URL}`}>На главную</Link>
                    </Button>
                </main>
            </div>
        </>
    )
}

export default LoginError;