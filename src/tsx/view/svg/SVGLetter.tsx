import * as React from 'react';
import Group from './Group';
import {partialCircle} from './SVGUtils';
import {classNames} from '../../component/ComponentUtils';
import {ISVGContext} from './SVGContext';
import {DraggableCore, DraggableData} from 'react-draggable';
import SVGContext from './SVGContext';
import ConditionalWrapper from '../../component/ConditionalWrapper';

export enum LetterGroups {
    DEEP_CUT = 'b|ch|d|h|f',
    SHALLOW_CUT = 'j|k|l|n|p|m',
    INSIDE = 't|sh|r|v|w|s',
    ON_LINE = 'th|y|z|qu|x|ng',
    DOUBLE_LETTERS = 'ch|sh|th|qu|ng',
}

export interface ILetter {
    readonly id: string;
    text: string;
    x: number;
    y: number;
    r: number;
    anglesOfLetter?: number[];
    anglesOfWord?: number[];
}

interface ISVGLetterProps {
    letter: ILetter;
    selection: string;
    select: (id: string) => void;
    onDrag: (x: number, y: number) => void;
}

interface ISVGLetterState {
    isHovered: boolean;
    isDragging: boolean;
}

class SVGLetter extends React.Component<ISVGLetterProps, ISVGLetterState> {

    constructor(props: ISVGLetterProps) {
        super(props);

        this.state = {
            isHovered: false,
            isDragging: false,
        };
    }

    public render() {

        const {getPartialCircle, onMouseEnter, onMouseLeave, onClick, draggableWrapper} = this;
        const {letter, selection} = this.props;
        const {x, y, r, anglesOfLetter, id} = letter;
        const isSelected = id === selection;
        const {isHovered} = this.state;

        const groupClassNames = classNames([
            'svg-letter',
            isSelected ? 'svg-letter--is-selected' : '',
            isHovered ? 'svg-letter--is-hovered' : '',
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
                    {anglesOfLetter
                        ? getPartialCircle()
                        : <circle r={r}/>
                    }

                </Group>
            </ConditionalWrapper>
        );
    }

    private getPartialCircle = () => {
        const {anglesOfLetter, r} = this.props.letter;

        if (anglesOfLetter) {
            const [start, end] = anglesOfLetter;

            return <path d={partialCircle(0, 0, r, start < end ? start + 2 * Math.PI : start, end)}/>;
        }

        return undefined;
    };

    private draggableWrapper = (children: React.ReactNode) => {
        const {onDragStart, onDragEnd, onDrag} = this;

        return (
            <SVGContext.Consumer>
                {(svgContext: ISVGContext) => (
                    <DraggableCore
                        enableUserSelectHack={true}
                        onStart={onDragStart}
                        onStop={onDragEnd}
                        onDrag={onDrag(svgContext)}
                    >
                        {children}
                    </DraggableCore>
                )}
            </SVGContext.Consumer>
        );
    };

    private onDragStart = () => this.setState({isDragging: true});
    private onDragEnd = () => this.setState({isDragging: false});
    private onDrag = (svgContext: ISVGContext) => (event: MouseEvent, data: DraggableData) => {
        const {x, y} = this.props.letter;
        const {deltaX, deltaY} = data;
        const {zoomX, zoomY} = svgContext;
        this.props.onDrag(x + deltaX / zoomX, y + deltaY / zoomY);
    };

    private onMouseEnter = (event: React.MouseEvent<SVGGElement>) => {
        this.setState(() => ({isHovered: true}));
        event.preventDefault();
    };

    private onMouseLeave = (event: React.MouseEvent<SVGGElement>) => {
        this.setState(() => ({isHovered: false}));
        event.preventDefault();
    };

    private onClick = () => this.props.select(this.props.letter.id);
}

export default SVGLetter;