import { updateSVGItemsAction } from '../store/AppStore';
import * as React from 'react';
import { DraggableData } from 'react-draggable';
import { useContext, useState } from 'react';
import { AppContextStateDispatch } from '../view/AppContext';
import { ISVGCircleItem } from '../types/SVG';

const useDrag = (svgItem: ISVGCircleItem) => {
    const dispatch = useContext(AppContextStateDispatch);
    const [isDragging, setIsDragging] = useState(false);

    const toggleDragging = (dragState: boolean) => () => setIsDragging(dragState);

    const onDrag = (zoomX: number, zoomY: number) => (event: React.MouseEvent<HTMLElement>, data: DraggableData) => {
        const { deltaX, deltaY } = data;

        dispatch(
            updateSVGItemsAction(svgItem, () => ({
                x: svgItem.x + deltaX / zoomX,
                y: svgItem.y + deltaY / zoomY
            }))
        );
    };

    return { toggleDragging, isDragging, onDrag };
};

export default useDrag;
