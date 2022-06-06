import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './tsx/App';
import { store } from './tsx/state/AppState';
import Theme from './tsx/Theme';

window.addEventListener('load', function load() {
    window.removeEventListener('load', load);
    const container = document.getElementById('root');
    const root = createRoot(container!);

    root.render(
        <Provider store={store}>
            <Theme>
                <App />
            </Theme>
        </Provider>
    );
});
