import { enableAllPlugins } from 'immer';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
import { ImageStore, imageStoreReducer } from './ImageStore';
import { svgPanZoomReducer, SvgPanZoomStore } from './SvgPanZoomStore';
import { WorkStore, workStoreReducer } from './WorkStore';

enableAllPlugins();

export interface AppStore {
    svgPanZoom: SvgPanZoomStore;
    image: ImageStore;
    work: WorkStore;
}

const reducer = combineReducers<AppStore>({
    svgPanZoom: svgPanZoomReducer,
    image: imageStoreReducer,
    work: workStoreReducer,
});

export const configureStoreWithDevTools = () => createStore(reducer, composeWithDevTools(applyMiddleware(logger)));
export const configureStore = () => createStore(reducer);
