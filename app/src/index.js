import React from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import WrappedMainComponent from "./App";
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './store/reducers';
import axios from 'axios';
import { Router } from '@unexp/router';
import { getApiLink } from "./utils/helpers";


export const store = createStore(rootReducer);

axios.defaults.baseURL = getApiLink();

// Init VK  Mini App
bridge.send("VKWebAppInit");

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <WrappedMainComponent />
    </Provider>
  </Router>

  , document.getElementById("root"));
if (process.env.NODE_ENV === "development") {
  import("./eruda").then(({ default: eruda }) => { }); //runtime download
}
