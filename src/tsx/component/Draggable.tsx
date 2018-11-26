import * as React from 'react';
import { ISVGContext } from '../view/svg/SVGContext';
import { DraggableCore, DraggableEventHandler } from 'react-draggable';
import SVGContext from '../view/svg/SVGContext';

interface IDraggableProps {
    isSelected: boolean;
    onDragStart: DraggableEventHandler;
    onDragStop: DraggableEventHandler;
    onDrag: (svgContext: ISVGContext) => DraggableEventHandler;
}

const Draggable: React.SFC<IDraggableProps> = ({
    onDragStart,
    onDragStop,
    onDrag,
    isSelected,
    children
}) => (
    <SVGContext.Consumer>
        {(svgContext: ISVGContext) => (
            <DraggableCore
                enableUserSelectHack={true}
                onStart={onDragStart}
                onStop={onDragStop}
                onDrag={onDrag(svgContext)}
                disabled={!isSelected}
            >
                {children}
            </DraggableCore>
        )}
    </SVGContext.Consumer>
);

export default Draggable;
