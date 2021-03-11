import React, { useContext, useState, useEffect } from 'react';

import { AdaptivityProvider } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import './styles/global.scss';
import bridge from '@vkontakte/vk-bridge';

import useAlertHook from './components/poputs/alert/useAlert';
import useSpinnerHook from './components/poputs/spinner/useSpinner';

import Panels from './Navigation';
import User from './utils/User';

const ViewContext = React.createContext();
const AlertContext = React.createContext();
const SessionContext = React.createContext();

const viewContext = () => useContext(ViewContext);
const alertContext = () => useContext(AlertContext);
const sessionContext = () => useContext(SessionContext);


const App = () => {

	const [userInfo, setUserInfo] = useState(null);
	const [poput, setPoput] = useState(null);
	const [activeStory, setActiveStory] = useState('table');
	const [activePanel, setActivePanel] = useState('table');
	const [isDesktop, setIsDesktop] = useState(false) 

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

	const setActiveStoryAndPanel = (story, panel) => {
		setActiveStory(story);
		setActivePanel(panel);
	}

	const viewContextValue = { setActivePanel, setActiveStory, activePanel, activeStory, setActiveStoryAndPanel }
	const alertContextValue = { useAlert, useSpinner, poput }
	const sessionContextValue = { isDesktop, setIsDesktop, userInfo }

	return (
		<AdaptivityProvider>
			<ViewContext.Provider value={viewContextValue}>
				<AlertContext.Provider value={alertContextValue}>
					<SessionContext.Provider value={sessionContextValue}>
						<Panels />
					</SessionContext.Provider>
				</AlertContext.Provider>
			</ViewContext.Provider>
		</AdaptivityProvider>
	);
};

export { viewContext, alertContext, sessionContext }
export default App;