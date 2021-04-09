import '../styles/globals.css';
import Router from 'next/router';
import Header from 'next/head';
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css'; //styles of nprogress

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import 'react-quill/dist/quill.snow.css';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }) {
	return (
		<>
			<Header>
				<title>#ТаняДизайн</title>
			</Header>
			<Component {...pageProps} />
		</>
	)
}



export default MyApp
