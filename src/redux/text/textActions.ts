import { createAction } from '@reduxjs/toolkit';

const setText = createAction<string>('TEXT/SET_TEXT');

const textActions = {
    setText,
};

export default textActions;
