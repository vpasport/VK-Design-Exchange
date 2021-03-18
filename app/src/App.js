import React, { useContext, useState, useEffect } from 'react';

import { AdaptivityProvider, ConfigProvider } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import './styles/global.scss';
import bridge from '@vkontakte/vk-bridge';

import useAlertHook from './components/poputs/alert/useAlert';
import useSpinnerHook from './components/poputs/spinner/useSpinner';

import Panels from './Navigation';
import User from './utils/User';

const AlertContext = React.createContext();
const SessionContext = React.createContext();
const ModalContext = React.createContext();

const alertContext = () => useContext(AlertContext);
const sessionContext = () => useContext(SessionContext);
const modalContext = () => useContext(ModalContext);

const App = () => {

	const [userInfo, setUserInfo] = useState(null);
	const [poput, setPoput] = useState(null);
	const [isDesktop, setIsDesktop] = useState(false);
	const [activeModal, setActiveModal] = useState(null);

	const useAlert = useAlertHook(setPoput);
	const useSpinner = useSpinnerHook(setPoput);

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data } }) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});

		const fetchData = async () => {

			try {
				const userInfo = await bridge.send('VKWebAppGetUserInfo');

				if (!('error_type' in userInfo))
					setUserInfo(new User(userInfo));
				else
					throw new Error('Ошибка API');
			}
			catch (error) {
				useAlert.error('Ошибка', error);
			}

		}

		fetchData();
	}, []);

	const alertContextValue = { useAlert, useSpinner, poput }
	const modalContextValue = { activeModal, setActiveModal }
	const sessionContextValue = { isDesktop, setIsDesktop, userInfo }

	return (
		<ConfigProvider>
			<AdaptivityProvider>
				<AlertContext.Provider value={alertContextValue}>
					<SessionContext.Provider value={sessionContextValue}>
						<ModalContext.Provider value={modalContextValue}>
							<Panels />
						</ModalContext.Provider>
					</SessionContext.Provider>
				</AlertContext.Provider>
			</AdaptivityProvider>
		</ConfigProvider>
	);
};

export { alertContext, sessionContext, modalContext }
export default App;