import { createTextReducer } from '@/redux/text/textReducer';
import { combineReducers } from 'redux';

const createReducer = () =>
    combineReducers({
        text: createTextReducer(),
    });

export default createReducer;
