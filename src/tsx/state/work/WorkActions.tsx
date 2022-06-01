import { createAction } from '@reduxjs/toolkit';
import { UUID } from '../image/ImageTypes';
import { Selection } from './WorkTypes';

export const setSelection = createAction<Omit<Selection, 'isDragging'> | undefined>('work/setSelection');
export const setHovering = createAction<UUID | undefined>('work/setHovering');
export const setIsDragging = createAction<boolean>('work/isDragging');
