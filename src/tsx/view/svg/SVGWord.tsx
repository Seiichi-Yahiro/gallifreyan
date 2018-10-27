import * as React from 'react';
import {partialCircle} from './SVGUtils';
import {CSSProperties} from 'react';
import Group from './Group';
import {classNames} from '../../component/ComponentUtils';
import {DraggableCore, DraggableData} from 'react-draggable';
import ConditionalWrapper from '../../component/ConditionalWrapper';
import SVGContext, {ISVGContext} from './SVGContext';

export interface IWord {
    readonly id: string;
    text: string;
}

interface ISVGWordProps {
    word: IWord;
    isSelected: boolean;
    onWordClick: (id: string) => void;
}

interface ISVGWordState {
    x: number;
    y: number;
    isHovered: boolean;
    isDragging: boolean;
}

class SVGWord extends React.Component<ISVGWordProps, ISVGWordState> {

    constructor(props: ISVGWordProps) {
        super(props);

        this.state = {
            x: 0,
            y: 0,
            isHovered: false,
            isDragging: false,
        };
    }

    public render() {
        const {draggableWrapper, onMouseEnter, onMouseLeave, onClick} = this;
        const {isSelected} = this.props;
        const {x, y, isHovered, isDragging} = this.state;
        const pathStyle: CSSProperties = {
            fill: 'transparent',
            strokeWidth: 1,
            stroke: 'inherit'
        };

        const groupClassNames = classNames([
            'svg-word',
            isSelected ? 'svg-word--is-selected' : '',
            isHovered ? 'svg-word--is-hovered' : '',
            isDragging ? 'svg-word--is-dragging' : '',
        ]);

        return (
            <ConditionalWrapper condition={isSelected} wrapper={draggableWrapper}>
                <Group
                    x={x}
                    y={y}
                    className={groupClassNames}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    onClick={onClick}
                >
                    <path d={partialCircle(0, 0, 50, 0, 2 * Math.PI)} style={pathStyle}/>
                </Group>
            </ConditionalWrapper>
        );
    }

    private draggableWrapper = (children: React.ReactNode) => {
        const {onDragStart, onDragEnd, onDrag} = this;

        return (
            <SVGContext.Consumer>
                {(svgContext: ISVGContext) => (
                    <DraggableCore enableUserSelectHack={true} onStart={onDragStart} onStop={onDragEnd} onDrag={onDrag(svgContext)}>
                        {children}
                    </DraggableCore>
                )}
            </SVGContext.Consumer>
        );
    };

    private onDragStart = () => this.setState({isDragging: true});
    private onDragEnd = () => this.setState({isDragging: false});
    private onDrag = (svgContext: ISVGContext) => (event: MouseEvent, data: DraggableData) => {
        const {x, y} = this.state;
        const {deltaX, deltaY} = data;
        const {zoomX, zoomY} = svgContext;

        this.setState({x: x + deltaX / zoomX, y: y + deltaY / zoomY});
    };

    private onMouseEnter = () => this.setState(() => ({isHovered: true}));
    private onMouseLeave = () => this.setState(() => ({isHovered: false}));
    private onClick = () => this.props.onWordClick(this.props.word.id);
}

export default SVGWord;