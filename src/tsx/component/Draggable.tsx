import * as React from 'react';
import { ISVGContext } from '../view/svg/SVGContext';
import { DraggableCore, DraggableEventHandler } from 'react-draggable';
import SVGContext from '../view/svg/SVGContext';
import withContext from '../hocs/WithContext';

interface IDraggableProps {
    isSelected: boolean;
    onDragStart: DraggableEventHandler;
    onDragStop: DraggableEventHandler;
    onDrag: (zoomX: number, zoomY: number) => DraggableEventHandler;
}

const Draggable: React.FunctionComponent<IDraggableProps & ISVGContext> = ({
    onDragStart,
    onDragStop,
    onDrag,
    isSelected,
    children,
    zoomX,
    zoomY
}) => (
    <DraggableCore
        enableUserSelectHack={isSelected}
        onStart={onDragStart}
        onStop={onDragStop}
        onDrag={onDrag(zoomX, zoomY)}
        disabled={!isSelected}
    >
        {children}
    </DraggableCore>
);

export default withContext(SVGContext)<IDraggableProps>(Draggable);
