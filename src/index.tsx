import '@style/index.scss';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './tsx/App';

window.addEventListener('load', function load() {
    window.removeEventListener('load', load);
    ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
});
