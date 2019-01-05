import * as React from 'react';
import { DraggableCore, DraggableEventHandler } from 'react-draggable';
import SVGContext from '../view/svg/SVGContext';

interface IDraggableProps {
    isSelected: boolean;
    onDragStart: DraggableEventHandler;
    onDragStop: DraggableEventHandler;
    onDrag: (zoomX: number, zoomY: number) => DraggableEventHandler;
}

const Draggable: React.FunctionComponent<IDraggableProps> = ({
    onDragStart,
    onDragStop,
    onDrag,
    isSelected,
    children
}) => (
    <SVGContext.Consumer>
        {({ zoomX, zoomY }) => (
            <DraggableCore
                enableUserSelectHack={isSelected}
                onStart={onDragStart}
                onStop={onDragStop}
                onDrag={onDrag(zoomX, zoomY)}
                disabled={!isSelected}
            >
                {children}
            </DraggableCore>
        )}
    </SVGContext.Consumer>
);

export default Draggable;
