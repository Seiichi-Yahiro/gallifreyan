import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './tsx/App';
import { configureStore } from './tsx/state/AppStore';

window.addEventListener('load', function load() {
    window.removeEventListener('load', load);
    const store = configureStore();
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('root')
    );
});
