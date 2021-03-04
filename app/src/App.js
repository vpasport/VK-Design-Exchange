import React, { useState, useEffect, useContext } from 'react';
import bridge from '@vkontakte/vk-bridge';
import View from '@vkontakte/vkui/dist/components/View/View';
import { AdaptivityProvider, AppRoot } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import useAlertHook from './components/poputs/alert/useAlert';
import useSpinnerHook from './components/poputs/spinner/useSpinner';

import Gallery from './panels/Gallery';
import Design from './panels/Design';
import User from './utils/User';

const ViewContext = React.createContext();

const useView = () => useContext(ViewContext);

const App = () => {
	const [activePanel, setActivePanel] = useState('gallery');
	const [activeDesign, setActiveDesign] = useState(null);
	const [userInfo, setUserInfo] = useState(null);
	const [poput, setPoput] = useState(null);

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
			catch(error){
				useAlert.error('Ошибка', error);
			}
			
		}

		fetchData();
	}, []);


	useEffect(() => {

		if (activeDesign)
			setActivePanel('design');

	}, [activeDesign])

	const context = { setActivePanel, useAlert, useSpinner }

	return (
		<ViewContext.Provider value={context}>
			<AdaptivityProvider>
				<AppRoot>
					<View activePanel={activePanel} popout={poput}>
						<Gallery
							onDesignChange={(designCard) => setActiveDesign(designCard)}
							id='gallery'
						/>
						<Design
							id='design'
							activeDesign={activeDesign}
						/>
					</View>
				</AppRoot>
			</AdaptivityProvider>
		</ViewContext.Provider>
	);
}

export default App;
export { useView }