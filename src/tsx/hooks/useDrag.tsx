import { updateSVGItemsAction } from '../store/AppStore';
import * as React from 'react';
import { DraggableData } from 'react-draggable';
import { useContext } from 'react';
import { AppContextStateDispatch } from '../view/AppContext';
import { ISVGCircleItem } from '../types/SVG';

const useDrag = (svgItem: ISVGCircleItem) => {
    const dispatch = useContext(AppContextStateDispatch);

    const toggleDragging = (dragState: boolean) => () =>
        dispatch(
            updateSVGItemsAction(svgItem, () => ({
                isDragging: dragState
            }))
        );

    const onDrag = (zoomX: number, zoomY: number) => (event: React.MouseEvent<HTMLElement>, data: DraggableData) => {
        const { deltaX, deltaY } = data;

        dispatch(
            updateSVGItemsAction(svgItem, () => ({
                x: svgItem.x + deltaX / zoomX,
                y: svgItem.y + deltaY / zoomY
            }))
        );
    };

    return { toggleDragging, onDrag };
};

export default useDrag;
