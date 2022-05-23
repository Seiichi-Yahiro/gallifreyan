import { createAction } from '@reduxjs/toolkit';
import { UUID } from '../image/ImageTypes';

export const setSelection = createAction<UUID | undefined>('work/setSelection');
export const setHovering = createAction<UUID | undefined>('work/setHovering');
