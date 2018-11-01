import * as React from 'react';
import Group from './Group';
import {classNames} from '../../component/ComponentUtils';
import {DraggableCore, DraggableData} from 'react-draggable';
import ConditionalWrapper from '../../component/ConditionalWrapper';
import SVGContext, {ISVGContext} from './SVGContext';
import SVGLetter, {ILetter, LetterGroups} from './SVGLetter';
import {IPoint, rotatePoint} from './SVGUtils';

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
    letters: ILetter[];
}

class SVGWord extends React.Component<ISVGWordProps, ISVGWordState> {

    constructor(props: ISVGWordProps) {
        super(props);

        this.state = {
            x: 0,
            y: 0,
            isHovered: false,
            isDragging: false,
            letters: [],
        };
    }

    public componentDidMount() {
        this.calculateLetters();
    }

    public componentDidUpdate(prevProps: ISVGWordProps) {
        if (prevProps.word.text !== this.props.word.text) {
            this.calculateLetters();
        }
    }

    public render() {
        const {draggableWrapper, onMouseEnter, onMouseLeave, onClick, calculateIntersectingLetters} = this;
        const {isSelected} = this.props;
        const {x, y, isHovered, isDragging, letters} = this.state;

        const intersectingLetters = calculateIntersectingLetters();

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
                    {intersectingLetters.length === 0 ? <circle r={50}/> : undefined}
                    {letters.map((letter: ILetter, index: number) => (
                        <SVGLetter letter={letter.letter} x={letter.x} y={letter.y} key={index}/>
                    ))}
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

    private calculateLetters = () => {
        const {word} = this.props;
        const letters = this.splitWordToLetters(word.text);
        const calculatedLetters = letters.map((letter: string, index: number) => {
            const radians = -(Math.PI * 2) / letters.length;
            const initialPoint: IPoint = {x: 0, y: 50}; // y is radius
            const point = rotatePoint(initialPoint, radians * index);

            return {
                ...point,
                letter,
            } as ILetter;
        });
        this.setState({letters: calculatedLetters});
    };

    private calculateIntersectingLetters = () => {
        const {word} = this.props;
        const letters = this.splitWordToLetters(word.text);
        const regex = new RegExp(`^(?:${LetterGroups.DEEP_CUT} | ${LetterGroups.SHALLOW_CUT})$`, 'i');
        return letters.filter((letter: string) => regex.test(letter));
    };

    private splitWordToLetters = (word: string): string[] => {
        const index = word.search(new RegExp(LetterGroups.DOUBLE_LETTERS, 'i'));

        if (index === -1) {
            return word.split('');
        } else {
            const firstPart = word.slice(0, index);
            const found = word.slice(index, index + 2);
            const lastPart = word.slice(index + 2);

            return firstPart.split('').concat(found).concat(this.splitWordToLetters(lastPart));
        }
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