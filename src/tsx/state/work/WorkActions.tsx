import { createAction } from '@reduxjs/toolkit';
import { UUID } from '../image/ImageTypes';
import { Selection } from './WorkTypes';

export const setSelection = createAction<Selection | undefined>('work/setSelection');
export const setHovering = createAction<UUID | undefined>('work/setHovering');
