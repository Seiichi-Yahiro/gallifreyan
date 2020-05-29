import { enableAllPlugins } from 'immer';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
import { ImageStore, imageStoreReducer } from './ImageStore';
import { WorkStore, workStoreReducer } from './WorkStore';

enableAllPlugins();

export interface AppStore {
    image: ImageStore;
    work: WorkStore;
}

const reducer = combineReducers<AppStore>({
    image: imageStoreReducer,
    work: workStoreReducer,
});

export const configureStore = () => createStore(reducer, composeWithDevTools(applyMiddleware(logger)));
