import React, { useContext, useState, useEffect, useMemo } from 'react';
import {  ANDROID, IOS, VKCOM } from "@vkontakte/vkui";

import { AdaptivityProvider, ConfigProvider, PanelSpinner } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import './styles/global.scss';
//import 'react-quill/dist/quill.snow.css';
import bridge from '@vkontakte/vk-bridge';

import useAlertHook from './components/poputs/alert/useAlert';
import useSpinnerHook from './components/poputs/spinner/useSpinner';

import Panels from './Navigation';
import User from './utils/User';
import { useDispatch } from 'react-redux';
import { changeUser } from './store/User/actions';

const AlertContext = React.createContext();
const SessionContext = React.createContext();
const ModalContext = React.createContext();

const alertContext = () => useContext(AlertContext);
const sessionContext = () => useContext(SessionContext);
const modalContext = () => useContext(ModalContext);

const App = () => {

	const [poput, setPoput] = useState(null);
	const [isDesktop, setIsDesktop] = useState(false);
	const [activeModal, setActiveModal] = useState(null);
	const [isLoad, setIsLoad] = useState(true);

	const useAlert = useAlertHook(setPoput);
	const useSpinner = useSpinnerHook(setPoput);

	const dispatch = useDispatch();

	const platform = useMemo(() => {
		let platform = new URLSearchParams(window.location.search).get("vk_platform");
		platform = 
			platform.includes("iphone") || platform.includes("mobile_web")
				? IOS
				: platform.includes("android")
					? ANDROID
					: VKCOM
		return platform;
	}, [])

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

				if (!('error_type' in userInfo)) {
					dispatch(changeUser(new User(userInfo, window.location.search)))

					setIsLoad(false);
				}
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
	const sessionContextValue = { isDesktop, setIsDesktop }

	return (
		<ConfigProvider platform={platform}>
			<AdaptivityProvider>
				<AlertContext.Provider value={alertContextValue}>
					<SessionContext.Provider value={sessionContextValue}>
						<ModalContext.Provider value={modalContextValue}>
							{!isLoad ?
								<Panels />
								:
								<PanelSpinner size='large' />
							}
						</ModalContext.Provider>
					</SessionContext.Provider>
				</AlertContext.Provider>
			</AdaptivityProvider>
		</ConfigProvider>
	);
};

export { alertContext, sessionContext, modalContext }
export default App;