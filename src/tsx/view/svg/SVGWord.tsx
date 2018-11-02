import * as React from 'react';
import Group from './Group';
import {classNames} from '../../component/ComponentUtils';
import {DraggableCore, DraggableData} from 'react-draggable';
import ConditionalWrapper from '../../component/ConditionalWrapper';
import SVGContext, {ISVGContext} from './SVGContext';
import SVGLetter, {ILetter, LetterGroups} from './SVGLetter';
import {calculateCircleIntersectionAngle, calculateCircleIntersectionPoints, partialCircle, Point} from './SVGUtils';

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
    r: number;
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
            r: 50,
            isHovered: false,
            isDragging: false,
            letters: [],
        };
    }

    public componentDidMount() {
        this.initializeLetters();
    }

    public componentDidUpdate(prevProps: ISVGWordProps) {
        if (prevProps.word.text !== this.props.word.text) {
            this.initializeLetters();
        }
    }

    public render() {
        const {draggableWrapper, onMouseEnter, onMouseLeave, onClick, calculateWordAnglePairs} = this;
        const {isSelected} = this.props;
        const {x, y, r, isHovered, isDragging, letters} = this.state;
        const wordAngles = calculateWordAnglePairs();

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
                    {wordAngles.length === 0
                        ? <circle r={r}/>
                        : wordAngles.map(([start, end], index: number) => (
                            <path d={partialCircle(0, 0, r, start, end)} key={index}/>
                        ))
                    }
                    {letters.map(({letter, x: lx, y: ly, r: lr}, index: number) => (
                        <SVGLetter letter={letter} x={lx} y={ly} r={lr} key={index}/>
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
                    <DraggableCore enableUserSelectHack={true} onStart={onDragStart} onStop={onDragEnd}
                                   onDrag={onDrag(svgContext)}>
                        {children}
                    </DraggableCore>
                )}
            </SVGContext.Consumer>
        );
    };

    private initializeLetters = () => {
        const {word} = this.props;
        const {r} = this.state;
        const letters = this.splitWordToLetters(word.text);
        const calculatedLetters = letters.map((letter: string, index: number) => {
            const radians = -(Math.PI * 2) / letters.length;
            const initialPoint = new Point(0, r);
            const rotatedPoint = initialPoint.rotate(radians * index);

            return {
                ...rotatedPoint,
                r: 25,
                letter,
            } as ILetter;
        });
        this.setState({letters: calculatedLetters});
        this.calculateAngles();
    };

    private calculateAngles = () => this.setState((prevState: ISVGWordState) => {
        const wordRadius = prevState.r;
        const letters = prevState.letters.map(letter => {
            const point = new Point(letter.x, letter.y);
            const letterRadius = letter.r;

            const intersections = calculateCircleIntersectionPoints(wordRadius, letterRadius, point);
            if (intersections.length !== 0) {
                let anglesOfWord = intersections
                    .map(p => calculateCircleIntersectionAngle(p, wordRadius))
                    .sort();
                
                // if circle is not on top the 0° point
                if (new Point(wordRadius, 0).subtract(point).length() > letterRadius) {
                    anglesOfWord = anglesOfWord.reverse();
                }

                // TODO check for 0° point necessary?
                const anglesOfLetter = intersections
                    .map(p => p.subtract(point))
                    .map(p => calculateCircleIntersectionAngle(p, letterRadius))
                    .sort()
                    .reverse();

                return {
                    ...letter,
                    anglesOfWord,
                    anglesOfLetter
                } as ILetter;
            }

            return letter;
        });

        return {letters};
    });

    private calculateWordAnglePairs = () => {
        const wordAngles = this.state.letters
            .map(letter => letter.anglesOfWord!)
            .filter(anglesOfWord => !!anglesOfWord)
            .reduce((a: number[], b: number[]) => a.concat(b), []);
        return [...wordAngles.slice(1), ...wordAngles.slice(0, 1)]
            .reduce((acc: number[][], angle: number, index: number) => {
                if (acc.length === Math.floor(index / 2 + 1)) {
                    acc[Math.floor(index / 2)].push(angle);
                } else {
                    acc.push([angle]);
                }

                return acc;
            }, [])
            .map(([start, end]) => [start < end ? start + 2 * Math.PI : start, end]);
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