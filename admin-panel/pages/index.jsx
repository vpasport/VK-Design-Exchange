import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import { Button } from 'primereact/button';

export default function Home() {
  const uri = encodeURIComponent(`${process.env.NEXT_PUBLIC_SELF_URL}/admin/portfolios`);

  return (
    <div className={styles.container}>
      <Head>
        <title>#ТаняДизайн</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Доска почёта #ТаняДизайн
        </h1>

        <Button className='p-mt-6'>
          <Link href={`${process.env.NEXT_PUBLIC_API_URL}/oauth/vk?redirect_uri=${uri}`}>Войти через ВКонтакте</Link>
        </Button>
      </main>

    </div>
  )
}

export async function getServerSideProps({ req: { headers: { cookie } } }) {
  let response = await fetch(`http://localhost:3001/`, {
    headers: {
      cookie
    }
  });

  return {
    props: {
    }
  }
}