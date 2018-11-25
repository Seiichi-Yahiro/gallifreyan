import * as React from 'react';
import { ISVGContext } from '../view/svg/SVGContext';
import { DraggableCore, DraggableEventHandler } from 'react-draggable';
import SVGContext from '../view/svg/SVGContext';
import ConditionalWrapper from './ConditionalWrapper';

interface IDraggableProps {
    isSelected: boolean;
    onDragStart: DraggableEventHandler;
    onDragStop: DraggableEventHandler;
    onDrag: (svgContext: ISVGContext) => DraggableEventHandler;
}

class Draggable extends React.Component<IDraggableProps> {
    public render() {
        const { isSelected, children } = this.props;
        const { draggableWrapper } = this;

        return (
            <ConditionalWrapper
                condition={isSelected}
                wrapper={draggableWrapper}
            >
                {children}
            </ConditionalWrapper>
        );
    }

    private draggableWrapper = (children: React.ReactNode) => {
        const { onDragStart, onDragStop, onDrag } = this.props;

        return (
            <SVGContext.Consumer>
                {(svgContext: ISVGContext) => (
                    <DraggableCore
                        enableUserSelectHack={true}
                        onStart={onDragStart}
                        onStop={onDragStop}
                        onDrag={onDrag(svgContext)}
                    >
                        {children}
                    </DraggableCore>
                )}
            </SVGContext.Consumer>
        );
    };
}
export default Draggable;
