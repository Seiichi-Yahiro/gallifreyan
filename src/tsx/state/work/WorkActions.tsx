import { createAction } from '@reduxjs/toolkit';
import { UUID } from '../image/ImageTypes';
import { Constraints, Selection } from './WorkTypes';

export const setSelection = createAction<Pick<Selection, 'id' | 'type'> | undefined>('work/setSelection');

export const setConstraints = createAction<{ id: UUID; constraints?: Constraints }>('work/setConstraints');

export const setIsDragging = createAction<boolean>('work/isDragging');
export const setJustDragged = createAction<boolean>('work/setJustDragged');

export const setHovering = createAction<UUID | undefined>('work/setHovering');

export const setTextInput = createAction<{ text: string; sanitizedText: string }>('work/setInputText');

export const setExpandedTreeNodes = createAction<UUID[]>('work/setExpandedTreeNodes');
