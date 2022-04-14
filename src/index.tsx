import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './tsx/App';
import { configureStore } from './tsx/state/AppStore';

window.addEventListener('load', function load() {
    window.removeEventListener('load', load);
    const store = configureStore();

    const container = document.getElementById('root');
    const root = createRoot(container!);

    root.render(
        <Provider store={store}>
            <App />
        </Provider>
    );
});
