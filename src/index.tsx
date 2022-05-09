import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './tsx/App';
import { createStore } from './tsx/state/AppState';

window.addEventListener('load', function load() {
    window.removeEventListener('load', load);
    const container = document.getElementById('root');
    const root = createRoot(container!);

    const store = createStore();

    root.render(
        <Provider store={store}>
            <App />
        </Provider>
    );
});
