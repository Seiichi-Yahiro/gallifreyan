import { createAction } from '@reduxjs/toolkit';
import { UUID } from '../image/ImageTypes';
import { Selection } from './WorkTypes';

export const setSelection = createAction<
    (Pick<Selection, 'id' | 'type'> & Partial<Pick<Selection, 'angleConstraints'>>) | undefined
>('work/setSelection');
export const setIsDragging = createAction<boolean>('work/isDragging');

export const setHovering = createAction<UUID | undefined>('work/setHovering');

export const setInputText = createAction<string>('work/setInputText');

export const setExpandedTreeNodes = createAction<UUID[]>('work/setExpandedTreeNodes');
